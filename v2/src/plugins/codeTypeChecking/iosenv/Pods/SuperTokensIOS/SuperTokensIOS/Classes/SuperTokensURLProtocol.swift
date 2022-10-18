//
//  SuperTokensURLProtocol.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

public class SuperTokensURLProtocol: URLProtocol {
    private static let readWriteDispatchQueue = DispatchQueue(label: "io.supertokens.session.readwrite", attributes: .concurrent)
    
    public override class func canInit(with request: URLRequest) -> Bool {
        if !SuperTokens.isInitCalled {
            // We cannot throw in this function because that would be an invalid override
            // In this case we need to rely on printing instead
            print("SuperTokens Error: SuperTokens.init has not been called")
            return false
        }
        
        // We only return true if we will be intercepting this request,
        // otherwise let normal execution continue
        //
        // NOTE: For iOS we dont check whether the request is being made for refreshing
        // because we use a custom URL session object so this protocol never gets called
        do {
            let doNotDoInterception = !(try Utils.shouldDoInterception(toCheckURL: request.url!.absoluteString, apiDomain: SuperTokens.config!.apiDomain, cookieDomain: SuperTokens.config!.cookieDomain))
            
            if !doNotDoInterception {
                // Returning true means that URLSession will use this class when making the request
                // Note: The system tries to call this function for all registered classes in order of registration
                return true
            }
            
        } catch {
            // No-op
        }
        
        // Returning false means the iOS will not use this class for this request
        return false
    }
    
    public override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }
    
    public override func startLoading() {
        // we have a read write lock here. We take a read lock while making a request and a write lock while refreshing
        // because if we dno't do that, then there may be a race condition where we may read a new id refresh token from storage
        // but the cookies may still be the older ones.
        SuperTokensURLProtocol.readWriteDispatchQueue.async {
            self.makeRequest()
        }
    }
    
    func makeRequest() {
        let mutableRequest = (self.request as NSURLRequest).mutableCopy() as! NSMutableURLRequest
        let preRequestIdRefresh = IdRefreshToken.getToken()
        
        if preRequestIdRefresh != nil {
            let antiCSRF = AntiCSRF.getToken(associatedIdRefreshToken: preRequestIdRefresh)
            if antiCSRF != nil {
                mutableRequest.addValue(antiCSRF!, forHTTPHeaderField: SuperTokensConstants.antiCSRFHeaderKey)
            }
        }
        
        if mutableRequest.value(forHTTPHeaderField: "rid") == nil {
            mutableRequest.addValue("anti-csrf", forHTTPHeaderField: "rid")
        }
        
        let apiRequest = mutableRequest.copy() as! URLRequest
        
        // We need to use a custom URLSession here because otherwise it will use this protocol, causing an infinite loop
        let customSession = URLSession(configuration: URLSessionConfiguration.default)
        customSession.dataTask(with: apiRequest, completionHandler: {
            data, response, error in
            
            if let httpResponse: HTTPURLResponse = response as? HTTPURLResponse {
                let headerFields = httpResponse.allHeaderFields as? [String:String]
                if headerFields != nil && response!.url != nil {
                    let idRefreshTokenFromResponse = httpResponse.allHeaderFields[SuperTokensConstants.idRefreshTokenHeaderKey]
                    if (idRefreshTokenFromResponse != nil) {
                        IdRefreshToken.setToken(newIdRefreshToken: idRefreshTokenFromResponse as! String, statusCode: httpResponse.statusCode);
                    }
                }
                
                if httpResponse.statusCode == SuperTokens.config!.sessionExpiredStatusCode {
                    SuperTokensURLProtocol.onUnauthorisedResponse(preRequestIdRefresh: preRequestIdRefresh, callback: {
                        unauthResponse in
                        
                        if unauthResponse.status == .RETRY {
                            self.makeRequest()
                        } else {
                            if IdRefreshToken.getToken() == nil {
                                AntiCSRF.removeToken()
                                FrontToken.removeToken()
                            }
                            
                            if unauthResponse.error != nil {
                                self.resolveToUser(data: nil, response: nil, error: unauthResponse.error)
                            } else {
                                self.resolveToUser(data: data, response: response, error: unauthResponse.error)
                            }
                        }
                    })
                } else {
                    let antiCSRFFromResponse = httpResponse.allHeaderFields[SuperTokensConstants.antiCSRFHeaderKey]
                    
                    if antiCSRFFromResponse != nil {
                        let idRefreshPostResponse = IdRefreshToken.getToken()
                        if idRefreshPostResponse != nil {
                            AntiCSRF.setToken(antiCSRFToken: antiCSRFFromResponse as! String, associatedIdRefreshToken: idRefreshPostResponse)
                        }
                    }
                    
                    let frontTokenFromHeaders = httpResponse.allHeaderFields[SuperTokensConstants.frontTokenHeaderKey]
                    
                    if frontTokenFromHeaders != nil {
                        FrontToken.setToken(frontToken: (frontTokenFromHeaders as! String))
                    }
                    
                    if IdRefreshToken.getToken() == nil {
                        AntiCSRF.removeToken()
                        FrontToken.removeToken()
                    }
                    
                    self.resolveToUser(data: data, response: response, error: error)
                }
            } else {
                self.resolveToUser(data: data, response: response, error: error)
            }
        }).resume()
    }
    
    func resolveToUser(data: Data?, response: URLResponse?, error: Error?) {
        // This will call the appropriate callbacks and return the data back to the user
        if error != nil {
            self.client?.urlProtocol(self, didFailWithError: error!)
        }
        
        if data != nil {
            self.client?.urlProtocol(self, didLoad: data!)
        }
        
        if response != nil {
            self.client?.urlProtocol(self, didReceive: response!, cacheStoragePolicy: .notAllowed)
        }
        
        // After everything, we need to call this to indicate to URLSession that this protocol has finished its task
        self.client?.urlProtocolDidFinishLoading(self)
    }
    
    static func onUnauthorisedResponse(preRequestIdRefresh: String?, callback: @escaping (UnauthorisedResponse) -> Void) {
        SuperTokensURLProtocol.readWriteDispatchQueue.async(flags: .barrier) {
            let postLockIdRefresh = IdRefreshToken.getToken()
            if postLockIdRefresh == nil {
                SuperTokens.config!.eventHandler(.UNAUTHORISED)
                callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.SESSION_EXPIRED))
                return
            }
            
            if postLockIdRefresh != preRequestIdRefresh {
                callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.RETRY))
                return;
            }
            
            let refreshUrl = URL(string: SuperTokens.refreshTokenUrl)!
            var refreshRequest = URLRequest(url: refreshUrl)
            refreshRequest.httpMethod = "POST"
            
            let antiCSRF = AntiCSRF.getToken(associatedIdRefreshToken: preRequestIdRefresh)
            if antiCSRF != nil {
                refreshRequest.addValue(antiCSRF!, forHTTPHeaderField: SuperTokensConstants.antiCSRFHeaderKey)
            }
            
            refreshRequest.addValue(SuperTokens.rid, forHTTPHeaderField: "rid")
            refreshRequest.addValue(Version.supported_fdi.joined(separator: ","), forHTTPHeaderField: "fdi-version")
            
            refreshRequest = SuperTokens.config!.preAPIHook(.REFRESH_SESSION, refreshRequest)
            
            let semaphore = DispatchSemaphore(value: 0)
            
            // We need to use a custom URLSession here because otherwise it will use this protocol, causing an infinite loop
            let customSession = URLSession(configuration: URLSessionConfiguration.default)
            let refreshTask = customSession.dataTask(with: refreshRequest, completionHandler: { data, response, error in
                
                if response as? HTTPURLResponse != nil {
                    let httpResponse = response as! HTTPURLResponse
                    let headerFields = httpResponse.allHeaderFields as? [String:String]
                    
                    var removeIdRefreshToken = true;
                    if headerFields != nil && response!.url != nil {
                        let idRefreshTokenFromResponse = httpResponse.allHeaderFields[SuperTokensConstants.idRefreshTokenHeaderKey]
                        if (idRefreshTokenFromResponse != nil) {
                            IdRefreshToken.setToken(newIdRefreshToken: idRefreshTokenFromResponse as! String, statusCode: httpResponse.statusCode);
                            removeIdRefreshToken = false;
                        }
                    }
                    
                    if httpResponse.statusCode == SuperTokens.config!.sessionExpiredStatusCode && removeIdRefreshToken {
                        IdRefreshToken.setToken(newIdRefreshToken: "remove", statusCode: httpResponse.statusCode);
                    }
                    
                    if httpResponse.statusCode >= 300 {
                        semaphore.signal()
                        callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.API_ERROR, error: SuperTokensError.apiError(message: "Refresh API returned with status code: \(httpResponse.statusCode)")))
                        return
                    }
                    
                    SuperTokens.config!.postAPIHook(.REFRESH_SESSION, refreshRequest, response)
                    
                    let idRefreshToken = IdRefreshToken.getToken()
                    
                    let antiCSRFFromResponse = httpResponse.allHeaderFields[SuperTokensConstants.antiCSRFHeaderKey]
                    if antiCSRFFromResponse != nil {
                        AntiCSRF.setToken(antiCSRFToken: antiCSRFFromResponse as! String, associatedIdRefreshToken: idRefreshToken)
                    }
                    
                    let frontTokenFromResponse = httpResponse.allHeaderFields[SuperTokensConstants.frontTokenHeaderKey]
                    if frontTokenFromResponse != nil {
                        FrontToken.setToken(frontToken: (frontTokenFromResponse as! String))
                    }
                    
                    if idRefreshToken == nil {
                        AntiCSRF.removeToken()
                        FrontToken.removeToken()
                        semaphore.signal()
                        callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.SESSION_EXPIRED))
                        return
                    }
                    
                    semaphore.signal()
                    SuperTokens.config!.eventHandler(.REFRESH_SESSION)
                    callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.RETRY))
                } else {
                    semaphore.signal()
                    callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.API_ERROR, error: error))
                }
            })
            refreshTask.resume()
            semaphore.wait()    // this is there so that this function call waits for the callback to exeicute so that we still have the write lock on our queue.
        }
    }
    
    public override func stopLoading() {
        // Do nothing, this is required to be implemented
    }
}
