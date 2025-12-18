#ifndef UPDATEFILECOMMAND_H
#define UPDATEFILECOMMAND_H

#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>

// Command to update the content of an existing file
class UpdateFileCommand : public ICommand {
private:
    IFileHandler* fileHandler;
    ICompressor* compressor;

public:
    // Constructor
    UpdateFileCommand(IFileHandler* fh, ICompressor* comp);

    // Execute the update command
    std::string execute(const std::string& args) override;
};

#endif