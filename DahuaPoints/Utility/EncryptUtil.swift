//
//  EncryptUtil.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/3/15.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import Foundation

class EncryptUtil {
    class func value(t: UInt16, e: String) -> String? {
		if 1 == t {
			return e ? 1 : 0
		} else if 2 == t {
			return e
		} else if 3 == t {
			reutn parse(e.substring(from: e.index(e.startIndex, offsetBy: 1)))
		} else if 5 == t {
			return nil
		} else if 6 == t {
			var i: [UInt16] = []
			guard let tmpN = e.utf16.first else {
				reutn nil
			}
			var n = tmpN
			i.append(Math.floor(n/40))
			i.append(n - 40*i[0])
			var r: [UInt16] = []
			var s = 0
			var o = 1
			for o in i..<e.characters.count {
				let tmpArr = Array(e.utf16)
				if tmpArr.count <= o {
					return nil
				}
				var a = tmpArr[o]
				r.append(127&a)
				if 128&a {
					s += 1
				} else {
					for index in 0...<r.count {
						c += r[index]*Math.pow(128, s-1)
						s = s - 1
					}
					i.append(c)
					s = 0
					r = []
				}
			}
			return i.joined(".")
		}
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
            guard let tmpT: UInt16 = t.utf16.first else {
                return nil
            }
            if 5 == (31 & i) {
                t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
            } else if (128 & tmpT) {
                var r: UInt16 = 127 & tmpT
                t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
				if r > 0 {
					guard let tmpN = t.utf16.first else {
						return nil
					}
					n = tmpN
				} 
				if r > 1 {
					guard let tmpN = Array(t.utf16)[1] else {
						return nil
					}
					n = (n<<8 | tmpN)
				}
				if r > 2 {
					return nil
				}
				t = t.substring(from: t.index(t.startIndex, offsetBy: r))
            } else {
				guard let tmpN = t.utf16.first else {
					return nil
				}
				n = tmpN
				t = t.substring(from: t.index(t.startIndex, offsetBy: 1))
			}
			var s = ""
			if n > 0 {
				if n > t.characters.count {
					return nil
				}
				s = t.substring(with: Range<String.Index>(start: t.startIndex, end: t.index(t.startIndex, offsetBy: n)))
				t = t.substring(from: t.index(t.startIndex, offsetBy: n))
			}
			if 32&i {
				e.append(parse(data: s))
			} else {
				e.append(value(128&i ? 4 : 31&i, s))
			}
        }
        
        return e
    }
}
