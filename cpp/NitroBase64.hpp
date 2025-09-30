#pragma once

#include "HybridNitroBase64Spec.hpp"
#include "simdutf.h"
#include <iostream>
#include <chrono>

namespace margelo::nitro::nitrobase64 {
    using namespace margelo::nitro;

    class NitroBase64 : public HybridNitroBase64Spec {
    public:
        NitroBase64() : HybridObject(TAG) {
            // Use pointer instead of copy
            const simdutf::implementation* impl = simdutf::get_active_implementation();
            std::cout << "[NitroBase64] Active implementation: " << impl->name() << std::endl;
            std::cout << "[NitroBase64] Description: " << impl->description() << std::endl;
        }

        std::string encode(const std::string &input) override {
            auto start = std::chrono::high_resolution_clock::now();
            
            size_t base64_size = simdutf::base64_length_from_binary(input.size());
            std::string output;
            output.resize(base64_size);
            
            auto t1 = std::chrono::high_resolution_clock::now();
            
            size_t actual_size = simdutf::binary_to_base64(
                input.data(),
                input.size(),
                output.data()
            );
            
            auto t2 = std::chrono::high_resolution_clock::now();
            
            output.resize(actual_size);
            auto end = std::chrono::high_resolution_clock::now();
            
            auto total = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
            auto encoding = std::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count();
            
            std::cout << "[encode] Total: " << total << "μs, Encoding: " << encoding
                      << "μs, Size: " << input.size() << " bytes" << std::endl;
            
            return output;
        }

        std::string decode(const std::string &base64) override {
            auto start = std::chrono::high_resolution_clock::now();
            
            size_t max_decoded_size = simdutf::maximal_binary_length_from_base64(
                base64.data(),
                base64.size()
            );
            
            std::string output;
            output.resize(max_decoded_size);
            
            auto t1 = std::chrono::high_resolution_clock::now();
            
            auto result = simdutf::base64_to_binary(
                base64.data(),
                base64.size(),
                output.data()
            );
            
            auto t2 = std::chrono::high_resolution_clock::now();
            
            if (result.error != simdutf::error_code::SUCCESS) {
                throw std::runtime_error("Base64 decode failed");
            }
            
            output.resize(result.count);
            auto end = std::chrono::high_resolution_clock::now();
            
            auto total = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
            auto decoding = std::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count();
            
            std::cout << "[decode] Total: " << total << "μs, Decoding: " << decoding
                      << "μs, Size: " << base64.size() << " bytes" << std::endl;
            
            return output;
        }

      

    private:
        static constexpr auto TAG = "NitroBase64";
    };
}
