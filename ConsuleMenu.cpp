#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

std::pair<std::string,std::string> ConsoleMenu::getCommandInput(const std::string& input) {
    if (input.empty()) {
        return {"", ""};
    }
    std::istringstream iss(input);
    std::string cmd;
    iss >> cmd;
    std::transform(cmd.begin(), cmd.end(), cmd.begin(), ::toupper);
    if (commandMap.find(cmd) == commandMap.end()) {
        return {"", ""};
    }
    std::string args;
    getline(iss, args);
    return {cmd, args};
}
