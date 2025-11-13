#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include <vector>

/** * This class handles user interaction through the console:
 *  - Reads user input commands and exceute them.
 *  - Handles invalid commands.
 */
class ConsoleMenu : public IMenu {
private:
     const std::map<std::string, ICommand*>& commandMap; 

public:
    ConsoleMenu(const std::map<std::string, ICommand*>& cmds) : commandMap(cmds) {}
    // Reads input and checks if the command is valid (ADD/GET/SEARCH)
    std::pair<std::string,std::string> getCommandInput(const std::string&) override;
 
};


#endif 
