//
//  ViewController.swift
//  DahuaPoints
//
//  Created by FengMengtao on 2017/2/3.
//  Copyright © 2017年 5icpp.com. All rights reserved.
//

import UIKit
import Alamofire

class ViewController: UIViewController {
    @IBOutlet weak var customLabel: UILabel!
    @IBOutlet weak var jishou: UILabel!

    @IBOutlet weak var tmpVertical: NSLayoutConstraint!
    
    private let gradient : CAGradientLayer = CAGradientLayer()
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        // for test *************************
//        jishou.clipsToBounds = true
//        jishou.layer.borderColor = UIColor.blue.cgColor
//        jishou.layer.borderWidth = 1
//        jishou.layer.cornerRadius = 3
//        
//        let data = 111111111111
//        let dataStr = String.init(format: "%d", data)
//        print(dataStr)
//        print("%qi", data)
        // for test *************************
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
    }
    
    
    @IBAction func clickGet(_ sender: Any) {
        DahuaPointsMgr.GetPoints(accounts: ["xf568816788@163.com":"xiaofeng.com"])
    }


}

