//
//  String.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

extension String {
    func trim() -> String {
        return self.trimmingCharacters(in: .whitespacesAndNewlines)
    }
    
    func matches(regex: String) -> Bool {
        return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: self)
    }
    
    func indexOf(character: Character) -> String.Index? {
        return self.firstIndex(of: character)
    }
    
    func substring(fromIndex: Int) -> String {
        if fromIndex >= self.count {
            return ""
        }
        
        let startIndex = self.index(self.startIndex, offsetBy: fromIndex)
        
        return String(self[startIndex..<self.endIndex])
    }
    
    func substring(fromIndex: Int, endIndex: String.Index) -> String {
        let startIndex = self.index(self.startIndex, offsetBy: fromIndex)
        return String(self[startIndex..<endIndex])
    }

    var isNumeric : Bool {
        let numberFormatter = NumberFormatter()
        return numberFormatter.number(from: self) != nil
    }
}
