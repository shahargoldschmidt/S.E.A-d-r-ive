#ifndef ICOMPRESS_H
#define ICOMPRESS_H

#include <string>

class ICompressor {
public:
    virtual std::string compress(const std::string& input) = 0;
    virtual std::string decompress(const std::string& input) = 0;

    virtual ~ICompressor() = default;
};

#endif