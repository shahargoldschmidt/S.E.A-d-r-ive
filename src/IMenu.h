#ifndef IMENU_H
#define IMENU_H

#include <string>

// Interface for any menu that gathers user commands
class IMenu {
public:
    virtual ~IMenu() = default;
    virtual std::string getInput() = 0; // gets input regardlees of the source
    virtual void respond(std::string message) = 0; // send response regardles of output 
};
#endif 
