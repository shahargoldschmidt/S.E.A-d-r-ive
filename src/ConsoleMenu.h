#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include <vector>


// Handles console input and output - read input and then send the output
class ConsoleMenu : public IMenu {
    
public:
    // Constructor
    ConsoleMenu();
    
    virtual ~ConsoleMenu() = default;

    // Reads a line from std::cin
    std::string getInput() override;

    // Prints a line to std::cout
    void respond(std::string message) override;
};

#endif