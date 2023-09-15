//
//  File.swift
//
//
//  Created by Matt Murray on 9/8/23.
//

import Foundation

extension Dictionary where Key: ExpressibleByStringLiteral {
    public mutating func lowerCaseKeys() {
        for key in self.keys {
            self[String(describing: key).lowercased() as! Key] = self.removeValue(forKey: key)
        }
    }
}
