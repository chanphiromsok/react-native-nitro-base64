package com.margelo.nitro.nitrobase64
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class NitroBase64 : HybridNitroBase64Spec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
