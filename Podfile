# Uncomment this line to define a global platform for your project
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, ‘8.0’

use_frameworks!
inhibit_all_warnings!

target 'DahuaPoints' do
	# Swift 3
	pod 'Alamofire'
    pod 'Moya/RxSwift'
	pod 'ObjectMapper', '~> 2.2'

end

post_install do |installer|
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings['SWIFT_VERSION'] = '3.0'
        end 
    end 
end
