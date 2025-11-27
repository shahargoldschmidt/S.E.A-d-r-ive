#ifndef RLESTRATEGY_H
#define RLESTRATEGY_H

#include "ICompressor.h"
#include <string>

// Implements RLE compression and decompression
class RLEStrategy : public ICompressor {
public:
    // Compresses the input string using RLE
    std::string compress(const std::string& input) override;
    // Decompresses the input string using RLE
    std::string decompress(const std::string& input) override;
};

#endif