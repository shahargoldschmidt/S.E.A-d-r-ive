#ifndef RLESTRATEGY_H
#define RLESTRATEGY_H

#include "ICompressor.h"
#include <string>

class RLEStrategy : public ICompressor {
public:
    std::string compress(const std::string& input) override;
    std::string decompress(const std::string& input) override;
};

#endif
