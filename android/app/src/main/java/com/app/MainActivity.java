package com.app;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import com.calendarevents.CalendarEventsPackage;

public class MainActivity extends ReactActivity {
   @Override
   public void onActivityResult(int requestCode, int resultCode, Intent data) {
       super.onActivityResult(requestCode, resultCode, data);
       MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
   }

   /**
    * Returns the name of the main component registered from JavaScript.
    * This is used to schedule rendering of the component.
    */
   @Override
   protected String getMainComponentName() {
       return "WeFit";
   }

   @Override
   public void onNewIntent (Intent intent) {
       super.onNewIntent(intent);
       setIntent(intent);
   }

   @Override
   public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
       CalendarEventsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults);
       super.onRequestPermissionsResult(requestCode, permissions, grantResults);
   }
}