#ifndef ADDFILECOMMAND_H
#define ADDFILECOMMAND_H

#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>

// This class handles the "add" command in the system

class AddFileCommand: public ICommand { // Inherits from ICommand
public:
    // Constructor including  a file handler and a compressor
    AddFileCommand(IFileHandler* fileHandler, ICompressor* compressor);

    // Executing an add command with the given input
    std::string execute(const std::string& input) override;

private:
    IFileHandler* fileHandler; // file handeling interface
    ICompressor* compressor;   // compressing interface
};

#endif