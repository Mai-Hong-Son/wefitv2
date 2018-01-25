/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <AVFoundation/AVFoundation.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTLog.h>
#import <React/RCTRootView.h>
#import <CodePush/CodePush.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNFIRMessaging.h"

@import FirebaseCore;

#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif

//#define DEBUG_IP @"192.168.0.153"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];

  // Use Ambient to keep other app's sounds when entering this app
  // [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
  
  // Use Playback to prioritize this app sounds over others
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];

  [self configureFIR];
  RCTSetLogThreshold(RCTLogLevelInfo);
  
#ifdef DEBUG
#ifdef DEBUG_IP
  NSString *urlString = [NSString stringWithFormat:@"http://%@:8081/index.ios.bundle?platform=ios&dev=true&minify=false", DEBUG_IP];
  NSURL *jsCodeLocation = [NSURL URLWithString:urlString];
#else
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings]
                           jsBundleURLForBundleRoot:@"index.ios"
                           fallbackResource:nil];
#endif // ifdef DEBUG_IP
#else
  NSURL *jsCodeLocation = [CodePush bundleURL];
#endif // ifdef DEBUG
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"WeFit"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  
  [RNSentry installWithRootView:rootView];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  BOOL wefitLink = [RCTLinkingManager application:application
                                          openURL:url
                                sourceApplication:sourceApplication
                                       annotation:annotation];
  
  BOOL facebookLink = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                     openURL:url
                                                           sourceApplication:sourceApplication
                                                                  annotation:annotation];
  return wefitLink || facebookLink;
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application
                          continueUserActivity:userActivity
                            restorationHandler:restorationHandler];
  NSLog(@"handle result: %d", result);
  return result;
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)())completionHandler {
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)configureFIR {
#ifdef DEBUG
  NSString *configsName = @"GoogleService-Info.dev";
#else
#ifdef STAGING
  NSString *configsName = @"GoogleService-Info.stg";
#else
  NSString *configsName = @"GoogleService-Info";
#endif
#endif
  
  NSString *configsPath = [[NSBundle mainBundle] pathForResource:configsName ofType:@"plist"];
  FIROptions *firebaseOptions = [[FIROptions alloc] initWithContentsOfFile:configsPath];
  [FIRApp configureWithOptions:firebaseOptions];
}

@end
