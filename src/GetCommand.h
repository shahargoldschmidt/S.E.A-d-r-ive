#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>
#include <iostream>

// Handles the get command, read  file name, decompresses, and outputs the result
class GetCommand : public ICommand {
private:
    IFileHandler* fileHandler;   // Handles reading files from the base path
    ICompressor* compressor;     // Responsible for RLE decompression

public:
    // Constructor with filehandler and compressor 
    GetCommand(IFileHandler* fh, ICompressor* comp);
    // return a string as the output 
    std::string execute(const std::string& args) override;
};

#endif
