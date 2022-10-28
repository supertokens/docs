//
//  NormalisedURLDomain.swift
//  SuperTokensSession
//
//  Created by Nemi Shah on 30/09/22.
//

import Foundation

class NormalisedURLDomain {
    private let value: String
    
    init(url: String) throws {
        self.value = try NormalisedURLDomain.normaliseUrlDomainOrThrowError(input: url)
    }
    
    func getAsStringDangerous() -> String {
        return self.value
    }
    
    static func normaliseUrlDomainOrThrowError(input: String, ignoreProtocol: Bool = false) throws -> String {
        var trimmedInput: String = input.trim()
        
        do {
            if !trimmedInput.starts(with: "http://") && !trimmedInput.starts(with: "https://") {
                throw SDKFailableError.failableError
            }
            
            guard let url: URL = URL(string: trimmedInput), let hostName: String = url.host, let scheme: String = url.scheme else {
                throw SDKFailableError.failableError
            }
            
            let hostSuffix = url.port == nil ? hostName : hostName + ":\(url.port!)"
            
            if ignoreProtocol {
                if hostName.starts(with: "localhost") || Utils.isIpAddress(input: hostName) {
                    trimmedInput = "http://" + hostSuffix
                } else {
                    trimmedInput = "https://" + hostSuffix
                }
            } else {
                trimmedInput = scheme + "://" + hostSuffix
            }
            
            return trimmedInput
        } catch {}
        
        if trimmedInput.starts(with: "/") {
            throw SuperTokensError.initError(message: "Please provide a valid domain name")
        }
        
        // not a valid URL
        if trimmedInput.indexOf(character: ".") == trimmedInput.startIndex {
            trimmedInput = trimmedInput.substring(fromIndex: 1)
        }
        
        // If the input contains a . it means they have given a domain name.
        // So we try assuming that they have given a domain name
        if (trimmedInput.indexOf(character: ".") != nil || trimmedInput.starts(with: "localhost")) && !trimmedInput.starts(with: "http://") && !trimmedInput.starts(with: "https://") {
            trimmedInput = "https://" + trimmedInput
            
            do {
                guard let _: URL = URL(string: trimmedInput) else {
                    throw SDKFailableError.failableError
                }
                
                return try normaliseUrlDomainOrThrowError(input: trimmedInput, ignoreProtocol: true)
            } catch {}
        }
        
        throw SuperTokensError.initError(message: "Please provide a valid domain name")
    }
}
