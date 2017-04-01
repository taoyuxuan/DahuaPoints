//
//  String+Ext.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/28.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation

extension String {
    func getLinks() -> [NSTextCheckingResult]? {
        let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue | NSTextCheckingResult.CheckingType.correction.rawValue)
        
        guard let detect = detector else {
            return nil
        }
        
        let matches = detect.matches(in: self, options: .reportCompletion, range: NSMakeRange(0, self.characters.count))
        
        return matches
    }
    
    func getAllAccurateLinks() -> [NSTextCheckingResult]? {
        let regulaStr = "((http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)|(www.[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)|([a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)"
        let regex = try? NSRegularExpression.init(pattern: regulaStr, options: NSRegularExpression.Options.caseInsensitive)
        
        let matches = regex?.matches(in: self, options: NSRegularExpression.MatchingOptions.reportCompletion, range: NSRange.init(location: 0, length: self.characters.count))
        
        return matches 
    }
}
