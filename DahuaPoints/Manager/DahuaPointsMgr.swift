//
//  DahuaPointsMgr.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/2/3.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//
import UIKit
import Foundation

private var cookies: Dictionary<String, Any>? = nil

class DahuaPointsMgr {
    class func GetPoints(accounts: Dictionary<String, String>) {
        
        print("T".utf16.first ?? 0)
        
        let decodeStr = EncryptUtil.base64Decode(string: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5gsH+AA4XWONB5TDcUd+xCz7ejOFHZKlcZDx+pF1i7Gsvi1vjyJoQhRtRSn950x498VUkx7rUxg1/ScBVfrRxQOZ8xFBye3pjAzfb22+RCuYApSVpJ3OO3KsEuKExftz9oFBv3ejxPlYc5yq7YiBO8XlTnQN0Sa4R4qhPO3I2MQIDAQAB")
        
        let data = EncryptUtil.parse(data: decodeStr)
        
        print(data)
        /*
        HTTPCookieStorage.shared.cookieAcceptPolicy = .always
        for (account, passowrd) in accounts {
            print("account: \(account)")
            print("password: \(passowrd)")
            
            let stamp = Int64(round(Date().timeIntervalSince1970 * 1000))
            dlReg163Provider.request(.ini(stamp), completion: { result in
                switch result {
                case .success(let response):
                    do {
                        let str = try response.mapString()
//                        let iniRet =
                    } catch {
                        print(error)
                    }
                case .failure(let error):
                    print(error)
                }
            })
            
//            ecard163ContentProvider.request(, completion: <#T##Completion##Completion##(Result<Response, MoyaError>) -> Void#>)
            
            getStartCookie { cookie in
                // get tmp cookie
                
            }
        }
 */
    }
}

extension DahuaPointsMgr {
    
    fileprivate class func getStartCookie(completion: @escaping (String) -> Void) {
        ecard163ContentProvider.request(.login_page) { result in
            switch result {
            case .success(let response):
                print("response: \(response)")
                completion("")
            case .failure(let error):
                print("error: \(error.localizedDescription)")
            }
        }
    }
    
    fileprivate class func loginEcard163(account: String, password: String, cookie: String) {
        // http://ecard.163.com/account_login?refer_uri=%2Faccount%2Fquery_balance
        ecard163ContentProvider.request(.handle_login(account, password)) { result in
            switch result {
            case .success(let response):
                print("\(response)")
            case .failure(let error):
                print("error: \(error)")
            }
        }
    }
    
    fileprivate class func get163TmpCookie(url: String) -> String {
        
        return ""
    }
}
