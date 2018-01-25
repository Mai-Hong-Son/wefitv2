package com.app;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import com.horcrux.svg.SvgPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.calendarevents.CalendarEventsPackage;
import io.sentry.RNSentryPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
 private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

 protected static CallbackManager getCallbackManager() {
   return mCallbackManager;
 }

 private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

   @Override
   protected String getJSBundleFile() {
     return CodePush.getJSBundleFile();
   }

   @Override
   public boolean getUseDeveloperSupport() {
     return BuildConfig.DEBUG;
   }

   @Override
   protected List<ReactPackage> getPackages() {
     return Arrays.<ReactPackage>asList(
         new MainReactPackage(),
            new GoogleAnalyticsBridgePackage(),
           new ReactVideoPackage(),
           new FIRMessagingPackage(),
           new RNI18nPackage(),
           new MapsPackage(),
           new ImagePickerPackage(),
           new SvgPackage(),
           new RNFetchBlobPackage(),
           new CalendarEventsPackage(),
           new RNSentryPackage(MainApplication.this),
           new ReactNativeYouTube(),
           new LinearGradientPackage(),
           new FBSDKPackage(mCallbackManager),
           new RNSpinkitPackage(),
           new VectorIconsPackage(),
           new RNDeviceInfo(),
           new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG)
     );
   }
 };

 @Override
 public ReactNativeHost getReactNativeHost() {
   return mReactNativeHost;
 }

 @Override
 public void onCreate() {
   super.onCreate();
   SoLoader.init(this, /* native exopackage */ false);
 }
}