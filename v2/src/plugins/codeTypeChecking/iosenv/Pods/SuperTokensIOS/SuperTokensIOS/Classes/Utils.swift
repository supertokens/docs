//
//  Utils.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

class NormalisedInputType {
    var apiDomain: String
    var apiBasePath: String
    var sessionExpiredStatusCode: Int
    var cookieDomain: String?
    var eventHandler: (EventType) -> Void
    var preAPIHook: (APIAction, URLRequest) -> URLRequest
    var postAPIHook: (APIAction, URLRequest, URLResponse?) -> Void
    var userDefaultsSuiteName: String?
    
    init(apiDomain: String, apiBasePath: String, sessionExpiredStatusCode: Int, cookieDomain: String?, eventHandler: @escaping (EventType) -> Void, preAPIHook: @escaping (APIAction, URLRequest) -> URLRequest, postAPIHook: @escaping (APIAction, URLRequest, URLResponse?) -> Void, userDefaultsSuiteName: String?) {
        self.apiDomain = apiDomain
        self.apiBasePath = apiBasePath
        self.sessionExpiredStatusCode = sessionExpiredStatusCode
        self.cookieDomain = cookieDomain
        self.eventHandler = eventHandler
        self.preAPIHook = preAPIHook
        self.postAPIHook = postAPIHook
        self.userDefaultsSuiteName = userDefaultsSuiteName

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
    
    internal static func normaliseInputType(apiDomain: String, apiBasePath: String?, sessionExpiredStatusCode: Int?, cookieDomain: String?, eventHandler: ((EventType) -> Void)?, preAPIHook: ((APIAction, URLRequest) -> URLRequest)?, postAPIHook: ((APIAction, URLRequest, URLResponse?) -> Void)?, userDefaultsSuiteName: String?) throws -> NormalisedInputType {
        let _apiDomain = try NormalisedURLDomain(url: apiDomain)
        var _apiBasePath = try NormalisedURLPath(input: "/auth")
        
        if apiBasePath != nil {
            _apiBasePath = try NormalisedURLPath(input: apiBasePath!)
        }
        
        var _sessionExpiredStatusCode: Int = 401
        if sessionExpiredStatusCode != nil {
            _sessionExpiredStatusCode = sessionExpiredStatusCode!
        }
        
        var _cookieDomain: String? = nil
        if cookieDomain != nil {
            _cookieDomain = try normaliseSessionScopeOrThrowError(sessionScope: cookieDomain!)
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
        
        return NormalisedInputType(apiDomain: _apiDomain.getAsStringDangerous(), apiBasePath: _apiBasePath.getAsStringDangerous(), sessionExpiredStatusCode: _sessionExpiredStatusCode, cookieDomain: _cookieDomain, eventHandler: _eventHandler, preAPIHook: _preAPIHook, postAPIHook: _postApiHook, userDefaultsSuiteName: userDefaultsSuiteName)
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
        if let _suiteName: String = SuperTokens.config!.userDefaultsSuiteName {
            if let _userDefaultsWithSuiteName: UserDefaults = UserDefaults(suiteName: _suiteName) {
                return _userDefaultsWithSuiteName
            } else {
                print("SuperTokens: Could not initialise user defaults with suite name '\(_suiteName)', using default")
            }
        }
        
        return UserDefaults.standard
    }
}

internal struct SignOutResponse: Codable {
    var status: String
    var message: String?
}
