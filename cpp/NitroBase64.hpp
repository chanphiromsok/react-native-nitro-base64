#pragma once

#include "HybridNitroBase64Spec.hpp"
#include "simdutf.h"

namespace margelo::nitro::nitrobase64 {
    using namespace margelo::nitro;

    class NitroBase64 : public HybridNitroBase64Spec {
    public: NitroBase64() : HybridObject(TAG) {}
        std::string encode(const std::string &input) override {
            // Calculate the required buffer size for base64 encoding
            size_t base64_size = simdutf::base64_length_from_binary(input.size());

            // Allocate buffer for encoded data
            std::vector<char> encoded_buffer(base64_size);

            // Perform base64 encoding using simdutf
            size_t actual_size = simdutf::binary_to_base64(
                    input.data(),
                    input.size(),
                    encoded_buffer.data()
            );

            // Return encoded string
            return std::string(encoded_buffer.data(), actual_size);
        }

        std::string decode(const std::string &base64) override {
            // Calculate the maximum possible decoded size
            size_t max_decoded_size = simdutf::maximal_binary_length_from_base64(base64.data(),
                                                                                 base64.size());

            // Allocate buffer for decoded data
            std::vector<char> decoded_buffer(max_decoded_size);

            // Perform base64 decoding using simdutf
            auto result = simdutf::base64_to_binary(
                    base64.data(),
                    base64.size(),
                    decoded_buffer.data()
            );

            if (result.error != simdutf::error_code::SUCCESS) {
                throw std::runtime_error("Base64 decode failed");
            }

            // Return decoded string with actual length
            return std::string(decoded_buffer.data(), result.count);
        }

    private:
        // Tag for logging/debugging within Nitro
        static constexpr auto TAG = "NitroBase64";
    };
}
