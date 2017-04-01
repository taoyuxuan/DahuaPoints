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
    
    fileprivate lazy var linkLabel = TTTAttributedLabel(frame: CGRect.zero)
    
    fileprivate lazy var customLinkLabel = UILabel()
    
    fileprivate var layoutManager = NSLayoutManager()
    fileprivate var textContainer = NSTextContainer.init(size: CGSize.zero)
    fileprivate var textStorage: NSTextStorage?
    fileprivate var linksProperties: [NSTextCheckingResult]?
    
    fileprivate var text = "站内信消息按照时间先后顺序进行排列，最新的消息放下面，进入站内信页面默认定位到最下方消息；长按系统消息可以复制和删除；如果有新系统消息，站内信icon有红点显示；www.meme.chat后顺序进行排列 baidu.com sdfsdfasfdasd后顺序进行排列"
    
    
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
        
//        linkLabel.frame = CGRect(x: 10, y: 450, width: 300, height: 200)
//        
//        linkLabel.numberOfLines = 0
//        linkLabel.delegate = self
//        linkLabel.isUserInteractionEnabled = true
//        linkLabel.enabledTextCheckingTypes = NSTextCheckingResult.CheckingType.link.rawValue
//        let text = "站内信消息按照时间先后顺序进行排列，最新的消息放下面，进入站内信页面默认定位到最下方消息；长按系统消息可以复制和删除；如果有新系统消息，站内信icon有红点显示；http://www.meme.chat后顺序进行排列 http://www.baidu.com后顺序进行排列"
//        linkLabel.setText(text)
//        view.addSubview(linkLabel)
        
        customLinkLabel.numberOfLines = 0
        customLinkLabel.frame = CGRect(x: 10, y: 450, width: 300, height: 200)
        customLinkLabel.lineBreakMode = .byWordWrapping
        customLinkLabel.isUserInteractionEnabled = true
        customLinkLabel.preferredMaxLayoutWidth = 300
        let att = NSMutableAttributedString.init(string: text, attributes: [NSFontAttributeName : UIFont.boldSystemFont(ofSize: 16)])
        let result = text.getAllAccurateLinks()
        if let links = result {
            linksProperties = links
            for link in links {
                let content = text as NSString
                let value = content.substring(with: link.range)
                let url = URL.init(string: value)
                att.addAttribute(NSLinkAttributeName, value: url ?? "", range: link.range)
                att.addAttribute(NSForegroundColorAttributeName, value: UIColor.blue, range: link.range)
            }
        }
        customLinkLabel.attributedText = att
        view.addSubview(customLinkLabel)
        let tapGR = UITapGestureRecognizer.init(target: self, action: #selector(ViewController.handleLabelTap(_:)))
        
        if linksProperties?.count ?? 0 > 0  {
            customLinkLabel.addGestureRecognizer(tapGR)
            
            textStorage = NSTextStorage(attributedString: att)
            layoutManager.addTextContainer(textContainer)
            textStorage?.addLayoutManager(layoutManager)
            
            // Configure textContainer
            textContainer.size = customLinkLabel.frame.size
            textContainer.lineFragmentPadding = 0.0;
            textContainer.lineBreakMode = customLinkLabel.lineBreakMode;
            textContainer.maximumNumberOfLines = customLinkLabel.numberOfLines;
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func clickGet(_ sender: Any) {
        DahuaPointsMgr.GetPoints(accounts: ["xf568816788@163.com":"xiaofeng.com"])
    }
}

extension ViewController : TTTAttributedLabelDelegate {
    func attributedLabel(_ label: TTTAttributedLabel!, didSelectLinkWith url: URL!) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
//    - (void)attributedLabel:(TTTAttributedLabel *)label
//    didSelectLinkWithURL:(NSURL *)url;
    
    func handleLabelTap(_ tapGesture: UITapGestureRecognizer) {
        let locationOfTouchInLabel = tapGesture.location(in: tapGesture.view)
        let labelSize = tapGesture.view?.bounds.size ?? CGSize(width: 0, height: 0)
        textContainer.size = customLinkLabel.frame.size
        let textBoundingBox = layoutManager.usedRect(for: textContainer)
        let textContainerOffset = CGPoint.init(x: (labelSize.width - textBoundingBox.size.width) * 0.5 - textBoundingBox.origin.x, y: (labelSize.height - textBoundingBox.size.height) * 0.5 - textBoundingBox.origin.y)
        
        let locationOfTouchInTextContainer = CGPoint.init(x: locationOfTouchInLabel.x - textContainerOffset.x, y: locationOfTouchInLabel.y - textContainerOffset.y)
        
        let indexOfCharacter = layoutManager.characterIndex(for: locationOfTouchInTextContainer, in: textContainer, fractionOfDistanceBetweenInsertionPoints: nil)
        
        if let links = linksProperties {
            for link in links {
                let range = link.range
                let value = (text as NSString).substring(with: range)
                if let url = URL.init(string: value), NSLocationInRange(indexOfCharacter, range) {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                }
            }
        }
//        NSRange linkRange = NSMakeRange(14, 4); // it's better to save the range somewhere when it was originally used for marking link in attributed string
//        if (NSLocationInRange(indexOfCharacter, linkRange)) {
//            // Open an URL, or handle the tap on the link in any other way
//            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://stackoverflow.com/"]];
//        }
        
    }
}
