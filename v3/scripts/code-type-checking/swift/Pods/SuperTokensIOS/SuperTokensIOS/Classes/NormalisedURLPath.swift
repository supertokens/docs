//
//  NormalisedURLPath.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

class NormalisedURLPath {
    private let value: String
    
    init(input: String) throws {
        self.value = try NormalisedURLPath.normaliseURLPathOrThrowError(input: input)
    }
    
    func startsWith(other: NormalisedURLPath) -> Bool {
        return self.value.starts(with: other.value)
    }
    
    func appendPath(other: NormalisedURLPath) throws -> NormalisedURLPath {
        return try NormalisedURLPath(input: self.value + other.value)
    }
    
    func getAsStringDangerous() -> String {
        return self.value
    }
    
    static func normaliseURLPathOrThrowError(input: String) throws -> String {
        var trimmedInput: String = input.trim()
        
        do {
            if !trimmedInput.starts(with: "http://") && !trimmedInput.starts(with: "https://") {
                throw SDKFailableError.failableError
            }
            
            guard let url: URL = URL(string: trimmedInput) else  {
                throw SDKFailableError.failableError
            }
            
            trimmedInput = url.path
            
            if trimmedInput.hasSuffix("/") {
                return trimmedInput.substring(fromIndex: 1)
            }
            
            return trimmedInput
        } catch {}
        
        // not a valid URL
        // If the input contains a . it means they have given a domain name.
        // So we try assuming that they have given a domain name + path
        if (isDomainGiven(input: trimmedInput) || trimmedInput.starts(with: "localhost")) && !trimmedInput.starts(with: "http://") && !trimmedInput.starts(with: "https://") {
            trimmedInput = "http://" + trimmedInput
            return try NormalisedURLPath.normaliseURLPathOrThrowError(input: trimmedInput)
        }
        
        if trimmedInput.indexOf(character: "/") != trimmedInput.startIndex {
            trimmedInput = "/" + trimmedInput
        }
        
        do {
            guard let _: URL = URL(string: "http://example.com" + trimmedInput) else {
                throw SDKFailableError.failableError
            }
            
            return try normaliseURLPathOrThrowError(input: "http://example.com" + trimmedInput)
        } catch {
            throw SuperTokensError.initError(message: "Please provide a valid URL path")
        }
    }
    
    static func isDomainGiven(input: String) -> Bool {
        // If no dot, return false.
        if input.indexOf(character: ".") == nil || input.starts(with: "/") {
            return false
        }
        
        do {
            guard let url: URL = URL(string: input), let hostname: String = url.host else {
                throw SDKFailableError.failableError
            }
            
            return hostname.indexOf(character: ".") != nil
        } catch {}
        
        do {
            guard let url: URL = URL(string: "http://" + input), let hostname: String = url.host else {
                throw SDKFailableError.failableError
            }
            
            return hostname.indexOf(character: ".") != nil
        } catch {}
        
        return false
    }
}
