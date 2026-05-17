#pragma once

#include "HybridNitroBase64Spec.hpp"
#include "simdutf.h"
#include <NitroModules/ArrayBuffer.hpp>

namespace margelo::nitro::nitrobase64 {
    using namespace margelo::nitro;

    class NitroBase64 : public HybridNitroBase64Spec {
    public:
        NitroBase64() : HybridObject(TAG) {}
        // work around call this to invoke Installing global Dispatcher Holder into Runtime
        void install() override {}

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

        std::string decode(const std::string &base64) override {
            size_t max_decoded_size = simdutf::maximal_binary_length_from_base64(
                base64.data(),
                base64.size()
            );

            std::string output(max_decoded_size, '\0');

            auto result = simdutf::base64_to_binary(
                base64.data(),
                base64.size(),
                output.data(),
                simdutf::base64_default_or_url
            );

            if (result.error != simdutf::error_code::SUCCESS) {
                throw std::runtime_error("Base64 decode failed");
            }

            output.resize(result.count);
            return output;
        }

        std::string encodeBuffer(const std::shared_ptr<ArrayBuffer>& input, bool urlSafe = false) override {
            auto opts = urlSafe ? simdutf::base64_url : simdutf::base64_default;
            size_t base64_size = simdutf::base64_length_from_binary(input->size(), opts);
            std::string output(base64_size, '\0');

            size_t actual_size = simdutf::binary_to_base64(
                reinterpret_cast<const char*>(input->data()),
                input->size(),
                output.data(),
                opts
            );

            output.resize(actual_size);
            return output;
        }

        std::shared_ptr<ArrayBuffer> decodeBuffer(const std::string &base64) override {
            size_t max_decoded_size = simdutf::maximal_binary_length_from_base64(
                base64.data(),
                base64.size()
            );

            std::vector<uint8_t> buffer(max_decoded_size);

            auto result = simdutf::base64_to_binary(
                base64.data(),
                base64.size(),
                reinterpret_cast<char*>(buffer.data()),
                simdutf::base64_default_or_url
            );

            if (result.error != simdutf::error_code::SUCCESS) {
                throw std::runtime_error("Base64 decode failed");
            }

            buffer.resize(result.count);
            return ArrayBuffer::move(std::move(buffer));
        }

    private:
        static constexpr auto TAG = "NitroBase64";
    };
}
