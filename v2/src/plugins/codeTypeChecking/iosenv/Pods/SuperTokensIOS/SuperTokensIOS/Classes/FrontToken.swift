//
//  FrontToken.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

internal class FrontToken {
    static var tokenInMemory: String? = nil
    static var userDefaultsKey: String = "supertokens-ios-fronttoken-key"
    private static let readWriteDispatchQueue = DispatchQueue(label: "io.supertokens.fronttoken.concurrent", attributes: .concurrent)
    private static var tokenInfoSemaphore = DispatchSemaphore(value: 0)
    
    private static func getFrontTokenFromStorage() -> String? {
        if tokenInMemory == nil {
            tokenInMemory = Utils.getUserDefaults().string(forKey: userDefaultsKey)
        }
        
        return tokenInMemory
    }
    
    private static func getFrontToken() -> String? {
        if Utils.getLocalSessionState().status == .NOT_EXISTS {
            return nil
        }
        
        return getFrontTokenFromStorage()
    }
    
    private static func parseFrontToken(frontTokenDecoded: String) -> [String: Any] {
        // In the event that the access token is not a valid base64 encoded json string, this will throw a runtime error
        let base64decodedData: Data = Data(base64Encoded: frontTokenDecoded)!
        let decodedString: String = String(data: base64decodedData, encoding: .utf8)!
        
        return try! JSONSerialization.jsonObject(with: decodedString.data(using: .utf8)!) as! [String: Any]
    }
    
    private static func getTokenInfo() -> [String: Any]? {
        var finalReturnValue: [String: Any]? = nil
        let executionSemaphore = DispatchSemaphore(value: 0)
        
        readWriteDispatchQueue.async {
            while (true) {
                let frontToken: String? = getFrontToken()
                
                if frontToken == nil {
                    let localSessionState = Utils.getLocalSessionState()
                    if localSessionState.status == .EXISTS {
                        tokenInfoSemaphore.wait()
                    } else {
                        finalReturnValue = nil
                        executionSemaphore.signal()
                        break
                    }
                } else {
                    finalReturnValue = parseFrontToken(frontTokenDecoded: frontToken!)
                    executionSemaphore.signal()
                    break
                }
            }
        }
        
        executionSemaphore.wait()
        return finalReturnValue
    }
    
    static func getToken() -> [String: Any]? {
        return getTokenInfo()
    }
    
    private static func setFrontTokenToStorage(frontToken: String?) {
        Utils.getUserDefaults().set(frontToken, forKey: userDefaultsKey)
        tokenInMemory = frontToken
    }
    
    private static func setFrontToken(frontToken: String?) {
        let oldToken = getFrontTokenFromStorage()
        
        if oldToken != nil && frontToken != nil {
            let oldTokenPayload: [String: Any] = parseFrontToken(frontTokenDecoded: oldToken!)["up"] as! [String : Any]
            let newPayload: [String: Any] = parseFrontToken(frontTokenDecoded: frontToken!)["up"] as! [String : Any]
            
            let oldPayloadString = String(data: try! JSONSerialization.data(withJSONObject: oldTokenPayload), encoding: .utf8)!
            let newPayloadString = String(data: try! JSONSerialization.data(withJSONObject: newPayload), encoding: .utf8)!
            
            if oldPayloadString != newPayloadString {
                SuperTokens.config!.eventHandler(.ACCESS_TOKEN_PAYLOAD_UPDATED)
            }
        }
        
        setFrontTokenToStorage(frontToken: frontToken)
    }
    
    private static func removeTokenFromStorage() {
        Utils.getUserDefaults().removeObject(forKey: userDefaultsKey)
        tokenInMemory = nil
    }
    
    static func removeToken() {
        let executionSemaphore = DispatchSemaphore(value: 0)
        
        readWriteDispatchQueue.async(flags: .barrier) {
            removeTokenFromStorage()
            Utils.setToken(tokenType: .access, value: "")
            Utils.setToken(tokenType: .refresh, value: "")
            tokenInfoSemaphore.signal()
            executionSemaphore.signal()
        }
        
        executionSemaphore.wait()
    }
    
    static func setItem(frontToken: String) {
        // We update the refresh attempt info here as well, since this means that we've updated the session in some way
        // This could be both by a refresh call or if the access token was updated in a custom endpoint
        // By saving every time the access token has been updated, we cause an early retry if
        // another request has failed with a 401 with the previous access token and the token still exists.
        // Check the start and end of onUnauthorisedResponse
        // As a side-effect we reload the anti-csrf token to check if it was changed by another tab.
        Utils.saveLastAccessTokenUpdate()
        
        if frontToken == "remove" {
            FrontToken.removeToken()
            return
        }
        
        FrontToken.setFrontToken(frontToken: frontToken)
    }
    
    static func doesTokenExist() -> Bool {
        let frontToken = FrontToken.getFrontTokenFromStorage()
        return frontToken != nil
    }
}
