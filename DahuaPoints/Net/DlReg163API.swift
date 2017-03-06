//
//  DlReg163API.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/6.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation
import Moya
import RxSwift

let dlReg163Provider = RxMoyaProvider<DlReg163API>(plugins: [NetworkLoggerPlugin(verbose: true)])

public enum DlReg163API {
    case ini(Int64)
    case gt(String, Int64)
//    case l
}

extension DlReg163API: TargetType {
    public var baseURL: URL {
        return URL(string: "http://dl.reg.163.com")!
    }
    
    /// The path to be appended to `baseURL` to form the full `URL`.
    public var path: String {
        switch self {
        case .ini(_): // get
            return "ini"
        case .gt(_, _):  // post
            return "/gt"
        }
    }
    
    /// The HTTP method used in the request.
    public var method: Moya.Method {
        switch self {
        case .ini(_): // get
            return .get
        case .gt(_, _):  // post
            return .get
        }
    }
    
    /// The parameters to be incoded in the request.
    public var parameters: [String: Any]? {
        switch self {
        case let .ini(timestamp):
//            pd=ecard&pkid=TdcueVw&pkht=ecard.163.com&nocache=1488774043089
            return ["pd" : "ecard", "pkid": "TdcueVw", "pkht": "ecard.163.com", "nocache": timestamp]
        case let .gt(account, stamp):
//            /gt?un=xf568816788%40163.com&pkid=TdcueVw&pd=ecard&nocache=1488774043091
            return ["un": account, "pkid": "TdcueVw", "pd": "ecard", "nocache":stamp]
        default:
            return nil
        }
    }
    
    /// The method used for parameter encoding.
    public var parameterEncoding: ParameterEncoding {
        return URLEncoding.default
    }
    
    /// The type of HTTP task to be performed.
    public var task: Task {
        switch self {
        case .ini(_):
            return .request
        case .gt( _, _):
            return .request
//        case .l:
//            return .request
        }
    }
    
    public var sampleData: Data {
        //        switch self {
        //        case .login_page:
        //            return "{code:\"0\"}".data(using: String.Encoding.utf8)!
        //        case .handle_login(_, _):
        //            return "{code:\"0\"}".data(using: String.Encoding.utf8)!
        //        case .query_balance:
        //            return "{code:\"0\"}".data(using: String.Encoding.utf8)!
        //        case .query_verify:
        //            return "{code:\"0\"}".data(using: String.Encoding.utf8)!
        //        case .handle_query_verify(_, _):
        //            return "{code:\"0\"}".data(using: String.Encoding.utf8)!
        //        }
        
        return "".data(using: String.Encoding.utf8)!
    }
}
