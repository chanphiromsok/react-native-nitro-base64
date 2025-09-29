#include <jni.h>
#include "nitrobase64OnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitrobase64::initialize(vm);
}
