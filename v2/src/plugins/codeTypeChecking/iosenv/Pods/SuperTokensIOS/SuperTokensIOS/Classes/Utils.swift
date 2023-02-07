//
//  Utils.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

internal enum TokenType {
    case access, refresh
}

extension TokenType {
    internal func getStorageName() -> String {
        if self == .access {
            return SuperTokensConstants.ACCESS_TOKEN_NAME
        }
        
        return SuperTokensConstants.REFRESH_TOKEN_NAME
    }
}

internal enum LocalSessionStateStatus {
    case NOT_EXISTS, EXISTS
}

internal class LocalSessionState {
    let status: LocalSessionStateStatus
    let lastAccessTokenUpdate: String?
    
    init(status: LocalSessionStateStatus, lastAccessTokenUpdate: String?) {
        self.status = status
        self.lastAccessTokenUpdate = lastAccessTokenUpdate
    }
}

public enum SuperTokensTokenTransferMethod: String {
    case cookie, header
}

class NormalisedInputType {
    var apiDomain: String
    var apiBasePath: String
    var sessionExpiredStatusCode: Int
    var sessionTokenBackendDomain: String?
    var eventHandler: (EventType) -> Void
    var preAPIHook: (APIAction, URLRequest) -> URLRequest
    var postAPIHook: (APIAction, URLRequest, URLResponse?) -> Void
    var userDefaultsSuiteName: String?
    var tokenTransferMethod: SuperTokensTokenTransferMethod
    
    init(apiDomain: String, apiBasePath: String, sessionExpiredStatusCode: Int, sessionTokenBackendDomain: String?, tokenTransferMethod: SuperTokensTokenTransferMethod, eventHandler: @escaping (EventType) -> Void, preAPIHook: @escaping (APIAction, URLRequest) -> URLRequest, postAPIHook: @escaping (APIAction, URLRequest, URLResponse?) -> Void, userDefaultsSuiteName: String?) {
        self.apiDomain = apiDomain
        self.apiBasePath = apiBasePath
        self.sessionExpiredStatusCode = sessionExpiredStatusCode
        self.sessionTokenBackendDomain = sessionTokenBackendDomain
        self.eventHandler = eventHandler
        self.preAPIHook = preAPIHook
        self.postAPIHook = postAPIHook
        self.userDefaultsSuiteName = userDefaultsSuiteName
        self.tokenTransferMethod = tokenTransferMethod
    }
    
    internal static func sessionScopeHelper(sessionScope: String) throws -> String {
        var trimmedSessionScope = sessionScope.trim()
        
        if trimmedSessionScope.starts(with: ".") {
            trimmedSessionScope = trimmedSessionScope.substring(fromIndex: 1)
        }
        
        if !trimmedSessionScope.starts(with: "http://") && !trimmedSessionScope.starts(with: "https://") {
            trimmedSessionScope = "http://" + trimmedSessionScope
        }
        
        do {
            guard let url: URL = URL(string: trimmedSessionScope), let host: String = url.host else {
                throw SDKFailableError.failableError
            }
            
            trimmedSessionScope = host
            
            if trimmedSessionScope.starts(with: ".") {
                trimmedSessionScope = trimmedSessionScope.substring(fromIndex: 1)
            }
            
            return trimmedSessionScope
        } catch {
            throw SuperTokensError.initError(message: "Please provide a valid sessionScope")
        }
    }
    
    internal static func normaliseSessionScopeOrThrowError(sessionScope: String) throws -> String {
        let noDotNormalised = try sessionScopeHelper(sessionScope: sessionScope)
        
        if noDotNormalised == "localhost" || Utils.isIpAddress(input: noDotNormalised) {
            return noDotNormalised
        }
        
        if sessionScope.starts(with: ".") {
            return "." + noDotNormalised
        }
        
        return noDotNormalised
    }
    
    internal static func normaliseInputType(apiDomain: String, apiBasePath: String?, sessionExpiredStatusCode: Int?, sessionTokenBackendDomain: String?, tokenTransferMethod: SuperTokensTokenTransferMethod?, eventHandler: ((EventType) -> Void)?, preAPIHook: ((APIAction, URLRequest) -> URLRequest)?, postAPIHook: ((APIAction, URLRequest, URLResponse?) -> Void)?, userDefaultsSuiteName: String?) throws -> NormalisedInputType {
        let _apiDomain = try NormalisedURLDomain(url: apiDomain)
        var _apiBasePath = try NormalisedURLPath(input: "/auth")
        
        if apiBasePath != nil {
            _apiBasePath = try NormalisedURLPath(input: apiBasePath!)
        }
        
        var _sessionExpiredStatusCode: Int = 401
        if sessionExpiredStatusCode != nil {
            _sessionExpiredStatusCode = sessionExpiredStatusCode!
        }
        
        var _sessionTokenBackendDomain: String? = nil
        if sessionTokenBackendDomain != nil {
            _sessionTokenBackendDomain = try normaliseSessionScopeOrThrowError(sessionScope: sessionTokenBackendDomain!)
        }
        
        var _eventHandler: (EventType) -> Void = { _ in }
        if eventHandler != nil {
            _eventHandler = eventHandler!
        }
        
        var _preAPIHook: (APIAction, URLRequest) -> URLRequest = {
            _, request in
            
            return request
        }
        if preAPIHook != nil {
            _preAPIHook = preAPIHook!
        }
        
        var _postApiHook: (APIAction, URLRequest, URLResponse?) -> Void = {
            _, _, _ in
        }
        if postAPIHook != nil {
            _postApiHook = postAPIHook!
        }
        
        var _tokenTransferMethod: SuperTokensTokenTransferMethod = .header
        
        if tokenTransferMethod != nil {
            _tokenTransferMethod = tokenTransferMethod!
        }
        
        
        return NormalisedInputType(apiDomain: _apiDomain.getAsStringDangerous(), apiBasePath: _apiBasePath.getAsStringDangerous(), sessionExpiredStatusCode: _sessionExpiredStatusCode, sessionTokenBackendDomain: _sessionTokenBackendDomain, tokenTransferMethod: _tokenTransferMethod, eventHandler: _eventHandler, preAPIHook: _preAPIHook, postAPIHook: _postApiHook, userDefaultsSuiteName: userDefaultsSuiteName)
    }
}

internal class Utils {
    internal static func shouldDoInterception(toCheckURL: String, apiDomain: String, cookieDomain: String?) throws -> Bool {
        let _toCheckURL: String = try NormalisedURLDomain.normaliseUrlDomainOrThrowError(input: toCheckURL)
        var _apiDomain: String = apiDomain
        
        guard let urlObj: URL = URL(string: _toCheckURL), let hostname: String = urlObj.host else {
            throw SDKFailableError.failableError
        }
        
        var domain = hostname
        
        if cookieDomain == nil {
            domain = urlObj.port == nil ? domain : domain + ":" + "\(urlObj.port!)"
            _apiDomain = try NormalisedURLDomain.normaliseUrlDomainOrThrowError(input: apiDomain)
            
            guard let apiUrlObj: URL = URL(string: _apiDomain), let apiHostName: String = apiUrlObj.host else {
                throw SDKFailableError.failableError
            }
            
            return domain == (apiUrlObj.port == nil ? apiHostName : apiHostName + ":" + "\(apiUrlObj.port!)")
        } else {
            var normalisedCookieDomain = try NormalisedInputType.normaliseSessionScopeOrThrowError(sessionScope: cookieDomain!)
            
            if cookieDomain!.split(separator: ":").count > 1 {
                let portString: String = String(cookieDomain!.split(separator: ":")[cookieDomain!.split(separator: ":").count - 1])
                
                if portString.isNumeric {
                    normalisedCookieDomain = normalisedCookieDomain + ":" + portString
                    domain = urlObj.port == nil ? domain : domain + ":" + "\(urlObj.port!)"
                }
            }
            
            if cookieDomain!.starts(with: ".") {
                return ("." + domain).hasSuffix(normalisedCookieDomain)
            } else {
                return domain == normalisedCookieDomain
            }
        }
    }
    
    internal static func isIpAddress(input: String) -> Bool {
        let regex: String = "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
        
        return input.matches(regex: regex)
    }
    
    internal static func getUserDefaults() -> UserDefaults {
        if let _suiteName: String = SuperTokens.config?.userDefaultsSuiteName {
            if let _userDefaultsWithSuiteName: UserDefaults = UserDefaults(suiteName: _suiteName) {
                return _userDefaultsWithSuiteName
            } else {
                print("SuperTokens: Could not initialise user defaults with suite name '\(_suiteName)', using default")
            }
        }
        
        return UserDefaults.standard
    }
    
    internal static func storeInStorage(name: String, value: String) {
        let storageKey = "st-storage-item-\(name)"
        let userDefaults = getUserDefaults()
        
        if value.isEmpty {
            userDefaults.removeObject(forKey: storageKey)
            userDefaults.synchronize()
            return
        }
        
        userDefaults.set(value, forKey: storageKey)
        userDefaults.synchronize()
    }
    
    internal static func saveLastAccessTokenUpdate() {
        let now = "\(Date().timeIntervalSince1970 * 1000)";
        
        storeInStorage(name: SuperTokensConstants.LAST_ACCESS_TOKEN_UPDATE, value: now)
        
        storeInStorage(name: "sIRTFrontend", value: "")
    }
    
    internal static func getFromStorage(name: String) -> String? {
        let itemInStorage = getUserDefaults().string(forKey: "st-storage-item-\(name)")
        
        if itemInStorage == nil {
            return nil
        }
        
        return itemInStorage
    }
    
    internal static func getLocalSessionState() -> LocalSessionState {
        let lastAccessTokenUpdate = getFromStorage(name: SuperTokensConstants.LAST_ACCESS_TOKEN_UPDATE)
        let frontTokenExists = FrontToken.doesTokenExist()
        
        if frontTokenExists && lastAccessTokenUpdate != nil {
            return LocalSessionState(status: .EXISTS, lastAccessTokenUpdate: lastAccessTokenUpdate)
        } else {
            return LocalSessionState(status: .NOT_EXISTS, lastAccessTokenUpdate: nil)
        }
    }
    
    internal static func setToken(tokenType: TokenType, value: String) {
        let name = tokenType.getStorageName()
        
        return storeInStorage(name: name, value: value)
    }
    
    internal static func saveTokenFromHeaders(httpResponse: HTTPURLResponse) {
        guard let headerFields: [String: String] = httpResponse.allHeaderFields as? [String: String] else {
            return
        }
        
        if let refreshToken: String = headerFields[SuperTokensConstants.refreshTokenHeaderKey] {
            Utils.setToken(tokenType: .refresh, value: refreshToken)
        }
        
        if let accessToken: String = headerFields[SuperTokensConstants.accessTokenHeaderKey] {
            Utils.setToken(tokenType: .access, value: accessToken)
        }
        
        if let frontToken: String = headerFields[SuperTokensConstants.frontTokenHeaderKey] {
            FrontToken.setItem(frontToken: frontToken)
        }
        
        if let antiCSRF: String = headerFields[SuperTokensConstants.antiCSRFHeaderKey] {
            let localSessionState = Utils.getLocalSessionState()
            
            AntiCSRF.setToken(antiCSRFToken: antiCSRF, associatedAccessTokenUpdate: localSessionState.lastAccessTokenUpdate)
        }
    }
    
    internal static func getTokenForHeaderAuth(tokenType: TokenType) -> String? {
        let name = tokenType.getStorageName()
        
        return getFromStorage(name: name)
    }
    
    internal static func setAuthorizationHeaderIfRequired(mutableRequest: NSMutableURLRequest, addRefreshToken: Bool = false) {
        // We set the Authorization header even if the tokenTransferMethod preference set in the config is cookies
        // since the active session may be using cookies. By default, we want to allow users to continue these sessions.
        // The new session preference should be applied at the start of the next session, if the backend allows it.
        
        let accessToken = Utils.getTokenForHeaderAuth(tokenType: .access)
        let refreshToken = Utils.getTokenForHeaderAuth(tokenType: .refresh)
        
        // We don't always need the refresh token because that's only required by the refresh call
        // Still, we only add the Authorization header if both are present, because we are planning to add an option to expose the
        // access token to the frontend while using cookie based auth - so that users can get the access token to use
        if accessToken != nil && refreshToken != nil {
            if mutableRequest.value(forHTTPHeaderField: "Authorization") != nil {
                // no-op
            } else {
                let tokenToAdd = addRefreshToken ? refreshToken! : accessToken!
                mutableRequest.setValue("Bearer \(tokenToAdd)", forHTTPHeaderField: "Authorization")
            }
        }
    }
    
    internal static func fireSessionUpdateEventsIfNecessary(
        wasLoggedIn: Bool,
        status: Int,
        frontTokenheaderFromResponse: String?
    ) {
        // In case we've received a 401 that didn't clear the session (e.g.: we've sent no session token, or we should try refreshing)
        // then onUnauthorised will handle firing the UNAUTHORISED event if necessary
        // In some rare cases (where we receive a 401 that also clears the session) this will fire the event twice.
        // This may be considered a bug, but it is the existing behaviour before the rework
        if frontTokenheaderFromResponse == nil {
            return
        }
        
        // if the current endpoint clears the session it'll set the front-token to remove
        // any other update means it's created or updated.
        let frontTokenExistsAfter = frontTokenheaderFromResponse != "remove"
        
        if wasLoggedIn {
            // we check for wasLoggedIn cause we don't want to fire an event
            // unnecessarily on first app load or if the user tried
            // to query an API that returned 401 while the user was not logged in...
            if !frontTokenExistsAfter {
                if status == SuperTokens.config!.sessionExpiredStatusCode {
                    SuperTokens.config!.eventHandler(.UNAUTHORISED)
                } else {
                    SuperTokens.config!.eventHandler(.SIGN_OUT)
                }
            }
        } else if frontTokenExistsAfter {
            SuperTokens.config!.eventHandler(.SESSION_CREATED)
        }
    }
}

internal struct SignOutResponse: Codable {
    var status: String
    var message: String?
}
