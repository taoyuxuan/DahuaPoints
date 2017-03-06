//
//  IniRet.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/6.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import ObjectMapper

class IniRet: Mappable {
    var ret = ""
    var dlapp = false
    var capFlag = 0
    
    required init?(map: Map) {
        
    }
    
    func mapping(map: Map) {
        ret     <- map["ret"]
        dlapp   <- map["dlapp"]
        capFlag <- map["capFlag"]
    }
}
