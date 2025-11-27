#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include <vector>


// Handles console input. read commands, splits into command,arguments, and validates them
class ConsoleMenu : public IMenu {
    private:
     std::istream& in; // Source of raw user input
    const std::map<std::string, ICommand*>& commandMap; // the command maps
public:
    // Constructor
    ConsoleMenu(std::istream& input, const std::map<std::string, ICommand*>& cmds);
    
    virtual ~ConsoleMenu() = default;

    // Reads a line from std::cin
    std::string getInput() override;

    // Prints a line to std::cout
    void respond(std::string message) override;
};

#endif