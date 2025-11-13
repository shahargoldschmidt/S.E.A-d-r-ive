#ifndef IMENU_H
#define IMENU_H

#include <string>

class IMenu {
public:
    virtual ~IMenu() = default;
    virtual std::string getCommandInput() = 0; // get input from user
    virtual void displayError(const std::string& msg) = 0; // handles error
};

#endif 
