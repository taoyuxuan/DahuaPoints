//
//  Ecard163API.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/2/8.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation
import Moya

let ecard163ContentProvider = RxMoyaProvider<Ecard163API>(plugins: [NetworkLoggerPlugin(verbose: true)])

public enum Ecard163API {
    case login_page
    case handle_login(String, String)
    case query_balance
    case query_verify
    case handle_query_verify(String, String)
}

extension Ecard163API: TargetType {
    public var baseURL: URL {
        return URL(string: "http://ecard.163.com")!
    }
    
    /// The path to be appended to `baseURL` to form the full `URL`.
    public var path: String {
        switch self {
        case .login_page: // get
            return "/account_login"
        case .handle_login(_, _):  // post
            return "/handle_login"
        case .query_balance: // get
            return "/account/query_balance"
        case .query_verify:  // get
            return "/query_verify"
        case .handle_query_verify( _, _): //post
            return "/handle_query_verify"
        }
    }
    
    /// The HTTP method used in the request.
    public var method: Moya.Method {
        switch self {
        case .login_page: // get
            return .get
        case .handle_login(_, _):  // post
            return .post
        case .query_balance: // get
            return .get
        case .query_verify:  // get
            return .get
        case .handle_query_verify( _, _): //post
            return .post
        }
    }
    
    /// The parameters to be incoded in the request.
    public var parameters: [String: Any]? {
        switch self {
        case let .handle_login(name, pwd):
            return ["123" : name, "456": pwd]
        case .handle_query_verify( _, _): //post
            return ["123": "123", "456": "456"]
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
        case .login_page:
            return .request
        case .handle_login( _, _):
            return .request
        case .query_balance:
            return .request
        case .query_verify:
            return .request
        case .handle_query_verify:
            return .request
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
