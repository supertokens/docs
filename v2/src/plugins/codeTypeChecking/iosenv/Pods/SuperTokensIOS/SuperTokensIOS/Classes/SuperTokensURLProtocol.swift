//
//  SuperTokensURLProtocol.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

public class SuperTokensURLProtocol: URLProtocol {
    private static let readWriteDispatchQueue = DispatchQueue(label: "io.supertokens.session.readwrite", attributes: .concurrent)
    
    // Refer to comment in makeRequest to know why this is needed
    private var requestForRetry: NSMutableURLRequest? = nil
    
    override public init(request: URLRequest, cachedResponse: CachedURLResponse?, client: URLProtocolClient?) {
        super.init(request: request, cachedResponse: cachedResponse, client: client)
    }
    
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
            let doNotDoInterception = !(try Utils.shouldDoInterception(toCheckURL: request.url!.absoluteString, apiDomain: SuperTokens.config!.apiDomain, cookieDomain: SuperTokens.config!.sessionTokenBackendDomain))
            
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
    
    private func removeAuthHeaderIfMatchesLocalToken(_mutableRequest: NSMutableURLRequest) -> NSMutableURLRequest {
        // .value is case insensitive
        if let originalAuthorizationHeader = _mutableRequest.value(forHTTPHeaderField: "Authorization") {
            let accessToken = Utils.getTokenForHeaderAuth(tokenType: .access)
            
            if accessToken != nil && originalAuthorizationHeader == "Bearer \(accessToken!)" {
                // Removing headers from a request is not case insensitive
                _mutableRequest.setValue(nil, forHTTPHeaderField: "Authorization")
                _mutableRequest.setValue(nil, forHTTPHeaderField: "authorization")
            }
        }
        
        return _mutableRequest
    }
    
    func makeRequest() {
        var mutableRequest = (self.request as NSURLRequest).mutableCopy() as! NSMutableURLRequest
        
        // When this function is called for retrying we cannot use the global request
        // because that will not have the modified headers
        if requestForRetry != nil {
            mutableRequest = requestForRetry!
            requestForRetry = nil
        }
        
        mutableRequest = removeAuthHeaderIfMatchesLocalToken(_mutableRequest: mutableRequest)
        
        let preRequestLocalSessionState = Utils.getLocalSessionState()
        
        if preRequestLocalSessionState.status == .EXISTS {
            let antiCSRF = AntiCSRF.getToken(associatedAccessTokenUpdate: preRequestLocalSessionState.lastAccessTokenUpdate!)
            if antiCSRF != nil {
                mutableRequest.setValue(antiCSRF!, forHTTPHeaderField: SuperTokensConstants.antiCSRFHeaderKey)
            }
        }
        
        if mutableRequest.value(forHTTPHeaderField: "rid") == nil {
            mutableRequest.addValue("anti-csrf", forHTTPHeaderField: "rid")
        }
        
        let tokenTransferMethod = SuperTokens.config!.tokenTransferMethod
        mutableRequest.setValue(tokenTransferMethod.rawValue, forHTTPHeaderField: "st-auth-mode")
        
        Utils.setAuthorizationHeaderIfRequired(mutableRequest: mutableRequest)
        
        let apiRequest = mutableRequest.copy() as! URLRequest
        
        // We need to use a custom URLSession here because otherwise it will use this protocol, causing an infinite loop
        let customSession = URLSession(configuration: URLSessionConfiguration.default)
        customSession.dataTask(with: apiRequest, completionHandler: {
            data, response, error in
            
            if let httpResponse: HTTPURLResponse = response as? HTTPURLResponse {
                Utils.saveTokenFromHeaders(httpResponse: httpResponse)
                Utils.fireSessionUpdateEventsIfNecessary(
                    wasLoggedIn: preRequestLocalSessionState.status == .EXISTS,
                    status: httpResponse.statusCode,
                    frontTokenheaderFromResponse: httpResponse.value(forHTTPHeaderField: SuperTokensConstants.frontTokenHeaderKey)
                )
                
                if httpResponse.statusCode == SuperTokens.config!.sessionExpiredStatusCode {
                    mutableRequest = self.removeAuthHeaderIfMatchesLocalToken(_mutableRequest: mutableRequest)
                    SuperTokensURLProtocol.onUnauthorisedResponse(preRequestLocalSessionState: preRequestLocalSessionState, callback: {
                        unauthResponse in
                        
                        if unauthResponse.status == .RETRY {
                            self.requestForRetry = mutableRequest
                            self.makeRequest()
                        } else {
                            SuperTokensURLProtocol.clearTokensIfRequired()
                            
                            if unauthResponse.error != nil {
                                self.resolveToUser(data: nil, response: nil, error: unauthResponse.error)
                            } else {
                                self.resolveToUser(data: data, response: response, error: unauthResponse.error)
                            }
                        }
                    })
                } else {
                    SuperTokensURLProtocol.clearTokensIfRequired()
                    
                    self.resolveToUser(data: data, response: response, error: error)
                }
            } else {
                SuperTokensURLProtocol.clearTokensIfRequired()
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
    
    static func onUnauthorisedResponse(preRequestLocalSessionState: LocalSessionState, callback: @escaping (UnauthorisedResponse) -> Void) {
        SuperTokensURLProtocol.readWriteDispatchQueue.async(flags: .barrier) {
            let postLockLocalSessionState = Utils.getLocalSessionState()
            
            if postLockLocalSessionState.status == .NOT_EXISTS {
                SuperTokens.config!.eventHandler(.UNAUTHORISED)
                callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.SESSION_EXPIRED))
                return
            }
            
            if postLockLocalSessionState.status != preRequestLocalSessionState.status || (postLockLocalSessionState.status == .EXISTS && preRequestLocalSessionState.status == .EXISTS && postLockLocalSessionState.lastAccessTokenUpdate! != preRequestLocalSessionState.lastAccessTokenUpdate!) {
                callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.RETRY))
                return;
            }
            
            let refreshUrl = URL(string: SuperTokens.refreshTokenUrl)!
            var refreshRequest = URLRequest(url: refreshUrl)
            refreshRequest.httpMethod = "POST"
            
            if preRequestLocalSessionState.status == .EXISTS {
                let antiCSRF = AntiCSRF.getToken(associatedAccessTokenUpdate: preRequestLocalSessionState.lastAccessTokenUpdate!)
                if antiCSRF != nil {
                    refreshRequest.addValue(antiCSRF!, forHTTPHeaderField: SuperTokensConstants.antiCSRFHeaderKey)
                }
            }
            
            refreshRequest.addValue(SuperTokens.rid, forHTTPHeaderField: "rid")
            refreshRequest.addValue(Version.supported_fdi.joined(separator: ","), forHTTPHeaderField: "fdi-version")
            
            let tokenTransferMethod = SuperTokens.config!.tokenTransferMethod
            refreshRequest.setValue(tokenTransferMethod.rawValue, forHTTPHeaderField: "st-auth-mode")
            
            // We need a mutable one here because URLRequest does not allow setting headers
            // if the request is passed as a param to a function
            let mutableRefreshRequest = (refreshRequest as NSURLRequest).mutableCopy() as! NSMutableURLRequest
            
            Utils.setAuthorizationHeaderIfRequired(mutableRequest: mutableRefreshRequest, addRefreshToken: true)
            
            refreshRequest = SuperTokens.config!.preAPIHook(.REFRESH_SESSION, mutableRefreshRequest.copy() as! URLRequest)
            
            let semaphore = DispatchSemaphore(value: 0)
            
            // We need to use a custom URLSession here because otherwise it will use this protocol, causing an infinite loop
            let customSession = URLSession(configuration: URLSessionConfiguration.default)
            let refreshTask = customSession.dataTask(with: refreshRequest, completionHandler: { data, response, error in
                
                if response as? HTTPURLResponse != nil {
                    let httpResponse = response as! HTTPURLResponse
                    
                    Utils.saveTokenFromHeaders(httpResponse: httpResponse)
                    
                    let isUnauthorised = httpResponse.statusCode == SuperTokens.config!.sessionExpiredStatusCode
                    
                    if isUnauthorised && httpResponse.value(forHTTPHeaderField: SuperTokensConstants.frontTokenHeaderKey) == nil {
                        FrontToken.setItem(frontToken: "remove")
                    }
                    
                    let frontTokenInHeaders = httpResponse.value(forHTTPHeaderField: SuperTokensConstants.frontTokenHeaderKey)
                    
                    Utils.fireSessionUpdateEventsIfNecessary(
                        wasLoggedIn: preRequestLocalSessionState.status == .EXISTS,
                        status: httpResponse.statusCode,
                        frontTokenheaderFromResponse: frontTokenInHeaders == nil ? "remove" : frontTokenInHeaders!
                    )
                    
                    SuperTokensURLProtocol.clearTokensIfRequired()
                    
                    if httpResponse.statusCode >= 300 {
                        semaphore.signal()
                        callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.API_ERROR, error: SuperTokensError.apiError(message: "Refresh API returned with status code: \(httpResponse.statusCode)")))
                        return
                    }
                    
                    SuperTokens.config!.postAPIHook(.REFRESH_SESSION, refreshRequest, response)
                    
                    if Utils.getLocalSessionState().status == .NOT_EXISTS {
                        // The execution should never come here.. but just in case.
                        // removed by server. So we logout

                        // we do not send "UNAUTHORISED" event here because
                        // this is a result of the refresh API returning a session expiry, which
                        // means that the frontend did not know for sure that the session existed
                        // in the first place.
                        semaphore.signal()
                        callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.SESSION_EXPIRED))
                        return
                    }
                    
                    semaphore.signal()
                    SuperTokens.config!.eventHandler(.REFRESH_SESSION)
                    callback(UnauthorisedResponse(status: UnauthorisedResponse.UnauthorisedStatus.RETRY))
                } else {
                    SuperTokensURLProtocol.clearTokensIfRequired()
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
    
    static func clearTokensIfRequired() {
        let preRequestLocalSessionState = Utils.getLocalSessionState()
        
        if preRequestLocalSessionState.status == .NOT_EXISTS {
            AntiCSRF.removeToken()
            FrontToken.removeToken()
        }
    }
}
