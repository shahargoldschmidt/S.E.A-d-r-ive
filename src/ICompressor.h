#pragma once
#include <string>

class ICompressor {
public:
    virtual ~ICompressor() = default;

    virtual std::string compress(const std::string& input) = 0;
    virtual std::string decompress(const std::string& input) = 0;
};
