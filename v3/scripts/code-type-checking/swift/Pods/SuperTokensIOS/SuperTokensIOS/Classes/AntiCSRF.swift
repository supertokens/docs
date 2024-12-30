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
        var associatedAccessTokenUpdate: String? = nil
        
        init(antiCSRFToken: String, associatedAccessTokenUpdate: String) {
            antiCSRF = antiCSRFToken
            self.associatedAccessTokenUpdate = associatedAccessTokenUpdate
        }
    }
    
    private static var antiCSRFInfo: AntiCSRFInfo? = nil
    private static let antiCSRFUserDefaultsKey = "supertokens-ios-anticsrf-key"
    
    internal static func getToken(associatedAccessTokenUpdate: String?) -> String? {
        if associatedAccessTokenUpdate == nil {
            AntiCSRF.antiCSRFInfo = nil
            return nil
        }
        
        if AntiCSRF.antiCSRFInfo == nil {
            let userDefaults = Utils.getUserDefaults()
            let antiCSRFToken = userDefaults.string(forKey: AntiCSRF.antiCSRFUserDefaultsKey)
            if ( antiCSRFToken == nil ) {
                return nil
            }
            
            AntiCSRF.antiCSRFInfo = AntiCSRFInfo(antiCSRFToken: antiCSRFToken!, associatedAccessTokenUpdate: associatedAccessTokenUpdate!)
        } else if AntiCSRF.antiCSRFInfo?.associatedAccessTokenUpdate != nil && AntiCSRF.antiCSRFInfo?.associatedAccessTokenUpdate != associatedAccessTokenUpdate! {
            AntiCSRF.antiCSRFInfo = nil
            return AntiCSRF.getToken(associatedAccessTokenUpdate: associatedAccessTokenUpdate)
        }
        
        return AntiCSRF.antiCSRFInfo!.antiCSRF
    }
    
    internal static func setToken(antiCSRFToken: String, associatedAccessTokenUpdate: String? = nil) {
        if associatedAccessTokenUpdate == nil {
            AntiCSRF.antiCSRFInfo = nil
            return;
        }
        
        let userDefaults = Utils.getUserDefaults()
        userDefaults.set(antiCSRFToken, forKey: AntiCSRF.antiCSRFUserDefaultsKey)
        userDefaults.synchronize()
        
        AntiCSRF.antiCSRFInfo = AntiCSRFInfo(antiCSRFToken: antiCSRFToken, associatedAccessTokenUpdate: associatedAccessTokenUpdate!)
    }
    
    internal static func removeToken() {
        let userDefaults = Utils.getUserDefaults()
        userDefaults.removeObject(forKey: AntiCSRF.antiCSRFUserDefaultsKey)
        userDefaults.synchronize()
        AntiCSRF.antiCSRFInfo = nil
    }
}
