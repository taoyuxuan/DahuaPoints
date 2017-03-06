//
//  GtRet.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/6.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import ObjectMapper

class GtRet: Mappable {
    var ret = ""
    var tk = ""
    
    required init?(map: Map) {
        
    }
    
    func mapping(map: Map) {
        ret    <- map["ret"]
        tk     <- map["tk"]
    }
}

