/* Copyright (c) 2020, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import Foundation

public enum EventType {
    case SIGN_OUT
    case REFRESH_SESSION
    case SESSION_CREATED
    case ACCESS_TOKEN_PAYLOAD_UPDATED
    case UNAUTHORISED
}

public enum APIAction {
    case SIGN_OUT
    case REFRESH_SESSION
}

public class SuperTokens {
    static var sessionExpiryStatusCode = 401
    static var isInitCalled = false
    static var refreshTokenUrl: String = ""
    static var signOutUrl: String = ""
    static var rid: String = ""
    static var config: NormalisedInputType? = nil
    
    
    internal static func resetForTests() {
        FrontToken.removeToken()
        AntiCSRF.removeToken()
        IdRefreshToken.removeToken()
        SuperTokens.isInitCalled = false
    }
    
    public static func initialize(apiDomain: String, apiBasePath: String? = nil, sessionExpiredStatusCode: Int? = nil, cookieDomain: String? = nil, userDefaultsSuiteName: String? = nil, eventHandler: ((EventType) -> Void)? = nil, preAPIHook: ((APIAction, URLRequest) -> URLRequest)? = nil, postAPIHook: ((APIAction, URLRequest, URLResponse?) -> Void)? = nil) throws {
        if SuperTokens.isInitCalled {
            return;
        }
        
        SuperTokens.config = try NormalisedInputType.normaliseInputType(apiDomain: apiDomain, apiBasePath: apiBasePath, sessionExpiredStatusCode: sessionExpiredStatusCode, cookieDomain: cookieDomain, eventHandler: eventHandler, preAPIHook: preAPIHook, postAPIHook: postAPIHook, userDefaultsSuiteName: userDefaultsSuiteName)
        
        guard let _config: NormalisedInputType = SuperTokens.config else {
            throw SuperTokensError.initError(message: "Error initialising SuperTokens")
        }
        
        SuperTokens.refreshTokenUrl = _config.apiDomain + _config.apiBasePath + "/session/refresh"
        SuperTokens.signOutUrl = _config.apiDomain + _config.apiBasePath + "/signout"
        SuperTokens.rid = "session"
        SuperTokens.isInitCalled = true
    }
    
    public static func doesSessionExist() -> Bool {
        let token = IdRefreshToken.getToken()
        return token != nil
    }
    
    public static func signOut(completionHandler: @escaping (Error?) -> Void) {
        if !doesSessionExist() {
            SuperTokens.config!.eventHandler(.SIGN_OUT)
            completionHandler(nil)
            return
        }
        
        guard let url: URL = URL(string: SuperTokens.signOutUrl) else {
            completionHandler(SuperTokensError.initError(message: "Please provide a valid apiDomain and apiBasePath"))
            return
        }
        
        let sessionConfiguration: URLSessionConfiguration = URLSessionConfiguration.default
        sessionConfiguration.protocolClasses?.insert(SuperTokensURLProtocol.self, at: 0)
        let customSession = URLSession(configuration: sessionConfiguration)
        
        var signOutRequest = URLRequest(url: url)
        signOutRequest.httpMethod = "POST"
        signOutRequest.addValue(SuperTokens.rid, forHTTPHeaderField: "rid")
        
        signOutRequest = SuperTokens.config!.preAPIHook(.SIGN_OUT, signOutRequest)
        
        let executionSemaphore = DispatchSemaphore(value: 0)
        
        customSession.dataTask(with: signOutRequest, completionHandler: {
            data, response, error in
            
            if let httpResponse: HTTPURLResponse = response as? HTTPURLResponse {
                if httpResponse.statusCode == SuperTokens.config!.sessionExpiredStatusCode {
                    // refresh must have already sent session expiry event
                    executionSemaphore.signal()
                    return
                }
                
                if httpResponse.statusCode >= 300 {
                    completionHandler(SuperTokensError.apiError(message: "Sign out failed with response code \(httpResponse.statusCode)"))
                    executionSemaphore.signal()
                    return
                }
                
                SuperTokens.config!.postAPIHook(.SIGN_OUT, signOutRequest, response)
                
                if let _data: Data = data, let jsonResponse: SignOutResponse = try? JSONDecoder().decode(SignOutResponse.self, from: _data) {
                    if jsonResponse.status == "GENERAL_ERROR" {
                        completionHandler(SuperTokensError.generalError(message: jsonResponse.message!))
                        executionSemaphore.signal()
                    } else {
                        completionHandler(nil)
                        executionSemaphore.signal()
                    }
                } else {
                    completionHandler(SuperTokensError.apiError(message: "Invalid sign out response"))
                    executionSemaphore.signal()
                }
            } else {
                completionHandler(nil)
                executionSemaphore.signal()
            }
            
            // we do not send an event here since it's triggered in setIdRefreshToken area.
        }).resume()
    }
    
    public static func attemptRefreshingSession() throws -> Bool {
        let preRequestIdRefreshToken = IdRefreshToken.getToken()
        var error: Error?
        let executionSemaphore = DispatchSemaphore(value: 0)
        var shouldRetry: Bool = false
        
        SuperTokensURLProtocol.onUnauthorisedResponse(preRequestIdRefresh: preRequestIdRefreshToken, callback: {
            unauthResponse in
            
            if unauthResponse.status == .API_ERROR {
                error = unauthResponse.error
            }
            
            shouldRetry = unauthResponse.status == .RETRY
            executionSemaphore.signal()
        })
        
        executionSemaphore.wait()
        
        if error != nil {
            throw error!
        }
        
        return shouldRetry
    }
    
    public static func getUserId() throws -> String {
        guard let frontToken: [String: Any] = FrontToken.getToken(), let userId: String = frontToken["uid"] as? String else {
            throw SuperTokensError.illegalAccess(message: "No session exists")
        }
        
        return userId
    }
    
    public static func getAccessTokenPayloadSecurely() throws -> [String: Any] {
        guard let frontToken: [String: Any] = FrontToken.getToken(), let accessTokenExpiry: Int = frontToken["ate"] as? Int, let userPayload: [String: Any] = frontToken["up"] as? [String: Any] else {
            throw SuperTokensError.illegalAccess(message: "No session exists")
        }
        
        if accessTokenExpiry < Date().millisecondsSince1970 {
            let retry = try SuperTokens.attemptRefreshingSession()
            
            if retry {
                return try getAccessTokenPayloadSecurely()
            } else {
                throw SuperTokensError.illegalAccess(message: "Could not refresh session")
            }
        }
        
        return userPayload
    }
}
