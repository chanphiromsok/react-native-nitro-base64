#include <jni.h>
#include "NitroBase64OnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return margelo::nitro::nitrobase64::initialize(vm);
}
//
//extern "C"
//JNIEXPORT jstring JNICALL Java_com_margelo_nitro_nitrobase64_NitroBase64_nativeEncode(JNIEnv* env, jobject /* this */, jstring input) {
//  if (input == nullptr) {
//    return nullptr;
//  }
//
//  // Get UTF-8 bytes directly from jstring - this is much faster than Kotlin conversion
//  const char* inputStr = env->GetStringUTFChars(input, nullptr);
//  if (inputStr == nullptr) {
//    return nullptr;
//  }
//
//  jsize inputLength = env->GetStringUTFLength(input);
//
//  // Calculate required output size for base64 encoding
//  size_t outputLength = simdutf::base64_length_from_binary(inputLength);
//  std::vector<char> output(outputLength);
//
//  // Encode UTF-8 bytes to base64 using simdutf
//  size_t actualLength = simdutf::binary_to_base64(
//    inputStr,
//    inputLength,
//    output.data(),
//    simdutf::base64_default
//  );
//
//  env->ReleaseStringUTFChars(input, inputStr);
//
//  return env->NewStringUTF(std::string(output.data(), actualLength).c_str());
//}
//
//extern "C"
//JNIEXPORT jstring JNICALL Java_com_margelo_nitro_nitrobase64_NitroBase64_nativeDecode(JNIEnv* env, jobject /* this */, jstring input) {
//  if (input == nullptr) {
//    return nullptr;
//  }
//
//  const char* inputStr = env->GetStringUTFChars(input, nullptr);
//  if (inputStr == nullptr) {
//    return nullptr;
//  }
//
//  jsize inputLength = env->GetStringUTFLength(input);
//
//  // Calculate maximum possible output size for base64 decoding
//  size_t maxOutputLength = simdutf::maximal_binary_length_from_base64(inputStr, inputLength);
//  std::vector<char> output(maxOutputLength);
//
//  // Decode base64 to binary
//  simdutf::result result = simdutf::base64_to_binary(
//    inputStr,
//    inputLength,
//    output.data(),
//    simdutf::base64_default
//  );
//
//  env->ReleaseStringUTFChars(input, inputStr);
//
//  if (result.error != simdutf::SUCCESS) {
//    // Handle decoding error - return null
//    return nullptr;
//  }
//
//  // Create UTF-8 string directly in native layer - much faster than Kotlin conversion
//  // The decoded binary data is UTF-8 encoded text, so we can create the string directly
//  return env->NewStringUTF(std::string(output.data(), result.count).c_str());
//}
