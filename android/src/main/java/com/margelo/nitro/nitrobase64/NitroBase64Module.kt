package com.margelo.nitro.nitrobase64

class NitroBase64Module: HybridNitroBase64ModuleSpec() {

  override fun install() {
    NitroBase64OnLoad.initializeNative()
  }
}
