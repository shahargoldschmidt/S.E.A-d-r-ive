#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include "CommandInput.h"
#include <vector>

/** * This class handles user interaction through the console:
 *  - Reads user input commands from any input stream.
 *  - Handles invalid commands that arent known in the command map.
 */
class ConsoleMenu : public IMenu {
private:
    std::istream& in;
    const std::map<std::string, ICommand*>& commandMap;

public:
    ConsoleMenu(std::istream& input, const std::map<std::string, ICommand*>& cmds)
        : in(input) , commandMap(cmds) {};
    CommandInput ConsoleMenu::getInput();
    std::pair<std::string,std::string> ConsoleMenu::seperateInput(const std::string& args);
};


#endif 
