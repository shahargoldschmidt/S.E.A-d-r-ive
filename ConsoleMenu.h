#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>

class ConsoleMenu : public IMenu {
public:
    // Reads input and checks if the command is valid (ADD/GET/SEARCH)
    std::string getCommandInput() override;
    // handles invalid input, 
    void displayError(const std::string& msg) override;
};

#endif 
