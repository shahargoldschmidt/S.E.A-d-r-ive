#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include "IFileHandler.h"
#include <string>

class DeleteCommand : public ICommand {
private:
    IFileHandler* fileHandler;

public:
    // constractur 
    DeleteCommand(IFileHandler* fh);

    // The function return string 
    std::string execute(const std::string& args) override;
};

#endif