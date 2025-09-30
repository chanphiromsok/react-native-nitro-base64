#pragma once

#include "HybridNitroBase64Spec.hpp"
#include "simdutf.h"

namespace margelo::nitro::nitrobase64 {
    using namespace margelo::nitro;

    class NitroBase64 : public HybridNitroBase64Spec {
    public:
        NitroBase64() : HybridObject(TAG) {}

        std::string encode(const std::string &input,bool urlSafe = false) override {
            size_t base64_size = simdutf::base64_length_from_binary(input.size());
            std::string output(base64_size, '\0');
            
            size_t actual_size = simdutf::binary_to_base64(
                input.data(),
                input.size(),
                output.data(),
                urlSafe ? simdutf::base64_url : simdutf::base64_default
            );
            
            output.resize(actual_size);
            return output;
        }

        std::string decode(const std::string &base64,bool urlSafe = false) override {
            size_t max_decoded_size = simdutf::maximal_binary_length_from_base64(
                base64.data(),
                base64.size()
            );
            
            std::string output(max_decoded_size, '\0');
            
            auto result = simdutf::base64_to_binary(
                base64.data(),
                base64.size(),
                output.data(),
                urlSafe ? simdutf::base64_url : simdutf::base64_default
            );
            
            if (result.error != simdutf::error_code::SUCCESS) {
                throw std::runtime_error("Base64 decode failed");
            }
            
            output.resize(result.count);
            return output;
        }

    private:
        static constexpr auto TAG = "NitroBase64";
    };
}
