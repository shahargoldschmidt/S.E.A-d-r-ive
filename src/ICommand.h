#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>
#include "CommandInput.h"

// Base interface for all command types (add, get, search)
class ICommand {
public:
    virtual ~ICommand() = default;
    // Execute the command
    virtual void execute(const std::string& args) = 0;
};

#endif 