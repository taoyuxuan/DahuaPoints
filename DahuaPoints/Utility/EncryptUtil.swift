//
//  EncryptUtil.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/15.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation

class EncryptUtil {
    class func value(t: UInt16, e: String) -> [Any]? {
		if 1 == t {
			return e != "" ? ["1"] : ["0"]
		} else if 2 == t {
			return [e]
		} else if 3 == t {
			return parse(data: e.substring(from: e.index(e.startIndex, offsetBy: 1)))
		} else if 5 == t {
			return nil
		} else if 6 == t {
			var i: [UInt16] = []
			guard let tmpN = e.utf16.first else {
				return nil
			}
			let n = tmpN
			i.append(UInt16(floor(Double(n)/40.0)))
			i.append(n - 40*i[0])
			var r: [UInt16] = []
			var s = 0
			for o in 1..<e.characters.count {
				let tmpArr = Array(e.utf16)
				if tmpArr.count <= o {
					return nil
				}
				let a = tmpArr[o]
				r.append(127&a)
				if 128&a > 0 {
					s += 1
				} else {
                    var c: UInt16 = 0
					for index in 0..<r.count {
                        let powResult = NSDecimalNumber(decimal: pow(128, s-1))
						c += r[index] * UInt16(powResult)
						s = s - 1
					}
					i.append(c)
					s = 0
					r = []
				}
			}
            return [i.map({ String($0)}).joined(separator: ".")]
		}
        return nil
    }
    
    class func parse(data: String?) -> [Any]? {
        guard let data = data else {
            return nil
        }

        var t = data
        var e: [Any] = []
        while t.characters.count > 0 {
            guard let i: UInt16 = t.utf16.first else {
                return nil
            }
            t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
            var n: UInt16 = 0
            guard let tmpT: UInt16 = t.utf16.first else {
                return nil
            }
            if 5 == (31 & i) {
                t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
            } else if ((128 & tmpT) != 0) {
                let r: UInt16 = 127 & tmpT
                t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
				if r > 0 {
					guard let tmpN = t.utf16.first else {
						return nil
					}
					n = tmpN
				} 
				if r > 1 {
					n = (n<<8 | Array(t.utf16)[1])
				}
				if r > 2 {
					return nil
				}
				t = t.substring(from: t.index(t.startIndex, offsetBy: Int(r)))
            } else {
				guard let tmpN = t.utf16.first else {
					return nil
				}
				n = tmpN
				t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
			}
			var s = ""
			if n != 0 {
				if n > UInt16(t.characters.count) {
					return nil
				}
                let range = t.startIndex..<t.index(t.startIndex, offsetBy: String.IndexDistance(n))
				s = t.substring(with: range)
				t = t.substring(from: t.index(t.startIndex, offsetBy: String.IndexDistance(n)))
			}
			if UInt16(32)&i != 0 {
                if let element = parse(data: s) {
                    e.append(contentsOf: element)
                }
			} else {
                var param: UInt16 = 31&i
                if 128&i != 0 {
                    param = 4
                }
                if let result = value(t: param, e: s) {
                    e.append(contentsOf: result)
                }
			}
        }
        
        return e
    }
    
    class func base64Decode(string: String) -> String? {
//        let data = string.data(using: String.Encoding.utf8)?.base64EncodedData(options: NSData.Base64EncodingOptions(rawValue: 0))
//        
//        guard let param = data else {
//            return nil
//        }
//        
//        return String(data: param, encoding: String.Encoding.utf8)
        let decodedData = NSData(base64Encoded: string, options: .init(rawValue: 0))

        let decodedString = NSString(data: decodedData as! Data, encoding: String.Encoding.utf8.rawValue)
        
        return decodedString as? String
    }
}
