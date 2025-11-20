#ifndef ICOMPRESSOR_H
#define ICOMPRESSOR_H

#include <string>

// Interface for classes that provide compression and decompression of text
class ICompressor {
public:
    // Compresses the given data and returns the encoded form
    virtual std::string compress(const std::string& input) = 0;
    // Restores previously compressed data to its original form
    virtual std::string decompress(const std::string& input) = 0;

    virtual ~ICompressor() = default;
};

#endif