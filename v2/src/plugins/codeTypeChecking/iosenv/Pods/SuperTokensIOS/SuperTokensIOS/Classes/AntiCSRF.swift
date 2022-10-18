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

// TODO: verify about locking
internal class AntiCSRF {
    class AntiCSRFInfo {
        var antiCSRF: String? = nil
        var idRefreshToken: String? = nil
        
        init(antiCSRFToken: String, associatedIdRefreshToken: String) {
            antiCSRF = antiCSRFToken
            idRefreshToken = associatedIdRefreshToken
        }
    }
    
    private static var antiCSRFInfo: AntiCSRFInfo? = nil
    private static let antiCSRFUserDefaultsKey = "supertokens-ios-anticsrf-key"
    
    internal static func getToken(associatedIdRefreshToken: String?) -> String? {
        if associatedIdRefreshToken == nil {
            AntiCSRF.antiCSRFInfo = nil
            return nil
        }
        
        if AntiCSRF.antiCSRFInfo == nil {
            let userDefaults = Utils.getUserDefaults()
            let antiCSRFToken = userDefaults.string(forKey: AntiCSRF.antiCSRFUserDefaultsKey)
            if ( antiCSRFToken == nil ) {
                return nil
            }
            
            AntiCSRF.antiCSRFInfo = AntiCSRFInfo(antiCSRFToken: antiCSRFToken!, associatedIdRefreshToken: associatedIdRefreshToken!)
        } else if AntiCSRF.antiCSRFInfo?.idRefreshToken != nil && AntiCSRF.antiCSRFInfo?.idRefreshToken != associatedIdRefreshToken! {
            AntiCSRF.antiCSRFInfo = nil
            return AntiCSRF.getToken(associatedIdRefreshToken: associatedIdRefreshToken)
        }
        
        return AntiCSRF.antiCSRFInfo!.antiCSRF
    }
    
    internal static func setToken(antiCSRFToken: String, associatedIdRefreshToken: String? = nil) {
        if associatedIdRefreshToken == nil {
            AntiCSRF.antiCSRFInfo = nil
            return;
        }
        
        let userDefaults = Utils.getUserDefaults()
        userDefaults.set(antiCSRFToken, forKey: AntiCSRF.antiCSRFUserDefaultsKey)
        userDefaults.synchronize()
        
        AntiCSRF.antiCSRFInfo = AntiCSRFInfo(antiCSRFToken: antiCSRFToken, associatedIdRefreshToken: associatedIdRefreshToken!)
    }
    
    internal static func removeToken() {
        let userDefaults = Utils.getUserDefaults()
        userDefaults.removeObject(forKey: AntiCSRF.antiCSRFUserDefaultsKey)
        userDefaults.synchronize()
        AntiCSRF.antiCSRFInfo = nil
    }
}
