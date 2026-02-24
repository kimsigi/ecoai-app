package com.kyolimsoft.rnd.ecoai.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest

class PlayIntegrityModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "PlayIntegrityModule"

  @ReactMethod
  fun requestIntegrityToken(nonce: String, projectNumber: String, promise: Promise) {
    val cloudProjectNumber = projectNumber.toLongOrNull()
    if (cloudProjectNumber == null) {
      promise.reject("INTEGRITY_ERROR", "Invalid cloud project number: $projectNumber")
      return
    }

    val integrityManager = IntegrityManagerFactory.create(reactContext)

    val request = IntegrityTokenRequest.builder()
      .setNonce(nonce)
      .setCloudProjectNumber(cloudProjectNumber)
      .build()

    integrityManager.requestIntegrityToken(request)
      .addOnSuccessListener { response -> promise.resolve(response.token()) }
      .addOnFailureListener { e -> promise.reject("INTEGRITY_ERROR", e) }
  }
}

class PlayIntegrityPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(PlayIntegrityModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
