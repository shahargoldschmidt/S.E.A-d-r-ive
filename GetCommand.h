#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>
#include <iostream>

class GetCommand : public ICommand
{
private:
    IFileHandler *fileHandler; // Handles reading files from the base path
    ICompressor *compressor;   // Responsible for RLE decompression
    std::ostream &out;         // Output stream (usually std::cout)

public:
    // Constructor
    GetCommand(IFileHandler *fh, ICompressor *comp, std::ostream &output)
        : fileHandler(fh), compressor(comp), out(output) {}

    void execute(const std::string &args) override;
};

#endif
