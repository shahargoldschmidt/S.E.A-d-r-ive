#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>

class ICommand {
public:
    virtual ~ICommand() = default;
    // Execute the command, passing user arguments as a string
    virtual void execute(const std::string& args) = 0;
};

#endif 