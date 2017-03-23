//
//  AppDelegate.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/2/3.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import UIKit
import Darwin

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
}

//extension AppDelegate {
//    // MARK: cpu useage
//    public func usageCPU() -> CGFloat {
//        var kr: kern_return_t = 0
//        var thread_list: UnsafeMutablePointer<thread_act_array_t?> = UnsafeMutablePointer<thread_act_array_t?>.allocate(capacity: 1)
//        thread_list.initialize(to: nil)
//        var thread_count: mach_msg_type_number_t = 0
//        
//        var thinfo: thread_info_data_t
//        var basic_info_th: thread_basic_info_t = thread_basic_info_t.allocate(capacity: 1)
//        basic_info_th.initialize(to: thread_basic_info())
//        
//        kr = task_threads(mach_task_self_, thread_list, &thread_count)
//
//        if kr != KERN_SUCCESS {
//            return -1
//        }
//        
//        var cpu_usage: CGFloat = 0;
//        let threadListPointer = thread_list
//        for i in 0..<thread_count {
//            var tmp_thinfo = thread_info_t.allocate(capacity: 1)
//            tmp_thinfo.initialize(to: 0)
//            var thread_info_count =  UnsafeMutablePointer<mach_msg_type_number_t>.allocate(capacity: 1)
//            thread_info_count.initialize(to: 0)
//            if let threadArr = thread_list.pointee {
//                kr  = thread_info(threadArr[Int(i)], thread_flavor_t(THREAD_BASIC_INFO), tmp_thinfo,  thread_info_count)
//                if kr != KERN_SUCCESS {
//                    return -1
//                }
//            } else {
//                return -1
//            }
//            
//            if !(basic_info_th.flags & TH_FLAGS_IDLE) {
//                cpu_usage += basic_info_th->cpu_usage
//            }
//        }
//        
////        cpu_usage = cpu_usage/CGFloat(TH_USAGE_SCALE) * 100.0
////        vm_deallocate(mach_task_self_, (vm_offset_t)thread_list, thread_count * sizeof(thread_t))
////
////        for (int i = 0; i < thread_count; i++)
////        {
////            thread_info_count = THREAD_INFO_MAX;
////            kr = thread_info(thread_list[i], THREAD_BASIC_INFO,(thread_info_t)thinfo, &thread_info_count);
////            if (kr != KERN_SUCCESS) {
////                return -1;
////            }
////            
////            basic_info_th = (thread_basic_info_t)thinfo;
////            
////            if (!(basic_info_th->flags & TH_FLAGS_IDLE))
////            {
////                cpu_usage += basic_info_th->cpu_usage;
////            }
////        }
////        
////        cpu_usage = cpu_usage / (float)TH_USAGE_SCALE * 100.0;
////        
////        vm_deallocate(mach_task_self(), (vm_offset_t)thread_list, thread_count * sizeof(thread_t));
//        
//        return cpu_usage
//    }
//    
//}

extension AppDelegate {
    func testPng() {
        do {
            if let image = UIImage(named:"123") {
                let data = UIImageJPEGRepresentation(image, 0.5)
                let path = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                let path_new = path.appendingPathComponent("123.png")
                if let data = data {
                    try data.write(to: path_new, options:NSData.WritingOptions.atomic)
                }
            }
        } catch {
            print(error)
        }
    }
}























