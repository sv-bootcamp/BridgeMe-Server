package com.yoda;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  private static final String MainComponent = "yoda";

  @Override
  protected String getMainComponentName() {
    return MainComponent;
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }
}