#pragma once

#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>

class AddFileCommand: public ICommand {
public:
    AddFileCommand(IFileHandler* fileHandler, ICompressor* compressor);

    void execute(const std::string& input) override;

private:
    IFileHandler* fileHandler;
    ICompressor* compressor;
};
