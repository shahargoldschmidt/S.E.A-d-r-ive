#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include "CommandInput.h"
#include <vector>


// Handles console input. read commands, splits into command,arguments, and validates them
class ConsoleMenu : public IMenu {
private:
     std::istream& in; // Source of raw user input
    const std::map<std::string, ICommand*>& commandMap; // the command maps
public:
    // Constructor with input stream and command map
    ConsoleMenu(std::istream& input, const std::map<std::string, ICommand*>& cmds);
    CommandInput getInput(); // Reads user input 
    CommandInput seperateInput(const std::string& args); // Splits the string

};

#endif 
