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
        if IdRefreshToken.getToken() == nil {
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
                    let idRefresh = IdRefreshToken.getToken()
                    if idRefresh != nil {
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
    
    static func setToken(frontToken: String?) {
        let executionSemaphore = DispatchSemaphore(value: 0)
        
        readWriteDispatchQueue.async(flags: .barrier) {
            setFrontToken(frontToken: frontToken)
            tokenInfoSemaphore.signal()
            executionSemaphore.signal()
        }
        
        executionSemaphore.wait()
    }
    
    private static func removeTokenFromStorage() {
        Utils.getUserDefaults().removeObject(forKey: userDefaultsKey)
        tokenInMemory = nil
    }
    
    static func removeToken() {
        let executionSemaphore = DispatchSemaphore(value: 0)
        
        readWriteDispatchQueue.async(flags: .barrier) {
            removeTokenFromStorage()
            tokenInfoSemaphore.signal()
            executionSemaphore.signal()
        }
        
        executionSemaphore.wait()
    }
}
