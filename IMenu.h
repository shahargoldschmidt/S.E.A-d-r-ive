#ifndef IMENU_H
#define IMENU_H

#include <string>
/**
 * This interface defines how any menu in the CLI should behave.
 * The main responsibilities:
 *  - Get command input from the user.
 *  - Display error messages when necessary.
 */
class IMenu {
public:
    virtual ~IMenu() = default;
    virtual std::pair<std::string,std::string> getCommandInput(const std::string&) = 0; // get input from user
};

#endif 
