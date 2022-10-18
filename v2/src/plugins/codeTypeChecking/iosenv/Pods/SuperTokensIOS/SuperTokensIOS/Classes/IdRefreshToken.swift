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

extension Date {
    var millisecondsSince1970:Int64 {
        return Int64((self.timeIntervalSince1970 * 1000.0).rounded())
    }
}

// TODO: verify about locking
internal class IdRefreshToken {
    private static var idRefreshInMemory: String? = nil
    private static var idRefreshUserDefaultsKey = "supertokens-ios-idrefreshtoken-key"
    
    internal static func getToken() -> String? {
        if ( IdRefreshToken.idRefreshInMemory == nil ) {
            idRefreshInMemory = Utils.getUserDefaults().string(forKey: IdRefreshToken.idRefreshUserDefaultsKey)
        }
        if (IdRefreshToken.idRefreshInMemory != nil) {
            let splitted = IdRefreshToken.idRefreshInMemory!.components(separatedBy: ";");
            let expiry = Int64(splitted[1])!;
            let currentTime = Date().millisecondsSince1970
            if expiry < currentTime {
                IdRefreshToken.removeToken()
            }
        }
        return IdRefreshToken.idRefreshInMemory
    }
    
    internal static func setToken(newIdRefreshToken: String, statusCode: Int) {
        let previousToken = getToken()
        if (newIdRefreshToken == "remove") {
            IdRefreshToken.removeToken()
        } else {
            let splitted = newIdRefreshToken.components(separatedBy: ";");
            let expiry = Int64(splitted[1])!;
            let currentTime = Date().millisecondsSince1970
            if expiry < currentTime {
                IdRefreshToken.removeToken()
            } else {
                let userDefaults = Utils.getUserDefaults()
                userDefaults.set(newIdRefreshToken, forKey: IdRefreshToken.idRefreshUserDefaultsKey)
                userDefaults.synchronize()
                IdRefreshToken.idRefreshInMemory = newIdRefreshToken
            }
        }
        
        if newIdRefreshToken == "remove" && previousToken != nil {
            if statusCode == SuperTokens.config!.sessionExpiredStatusCode {
                SuperTokens.config!.eventHandler(.UNAUTHORISED)
            } else {
                SuperTokens.config!.eventHandler(.SIGN_OUT)
            }
        }
        
        if newIdRefreshToken != "remove" && previousToken == nil {
            SuperTokens.config!.eventHandler(.SESSION_CREATED)
        }
    }
    
    internal static func removeToken() {
        let userDefaults = Utils.getUserDefaults()
        userDefaults.removeObject(forKey: IdRefreshToken.idRefreshUserDefaultsKey)
        userDefaults.synchronize()
        IdRefreshToken.idRefreshInMemory = nil
    }
}
