#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>

// Base interface for all command types
class ICommand {
public:
    virtual ~ICommand() = default;
    // Execute the command
    virtual string execute(const std::string& args) = 0;
};

#endif 