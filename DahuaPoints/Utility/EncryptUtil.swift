//
//  EncryptUtil.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/15.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation

class EncryptUtil {
    class func value(data: String) -> String? {
        return nil
    }
    
    class func parse(data: String?) -> String? {
        guard let data = data else {
            return nil
        }

        var e: [String] = []
        while data.characters.count > 0 {
            guard let i: UInt16 = data.utf16.first else {
                return nil
            }
            var t = data.substring(from: data.index(data.startIndex, offsetBy: 1))
            var n = 0
            guard let tmpT = t.utf16.first else {
                return nil
            }
            if 5 == (31 & i) {
                t = t.substring(from: data.index(data.startIndex, offsetBy: 1))
            } else if (128 & tmpT) {
                var r = 127 & tmpT
                
            }
//            t = 
        }
        
        return nil
    }
}
