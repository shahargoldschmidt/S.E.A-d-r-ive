#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include "CommandInput.h"
#include <vector>


// handles user interaction through the console:
// Reads user input commands from a specified stream.
// parsing the input into a command and arguments,
// and validating the command against the provided map of known commands
class ConsoleMenu : public IMenu {
private:
     std::istream& in; // Source of raw user input
    const std::map<std::string, ICommand*>& commandMap; // Valid commands and their handlers

public:
    ConsoleMenu(std::istream& input, const std::map<std::string, ICommand*>& cmds);
    CommandInput getInput();
    CommandInput seperateInput(const std::string& args);

};


#endif 
