#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

std::string ConsoleMenu::getCommandInput(const std::string& input) {
    if (input.empty()) {
        // does nothing
        return HandleError("");
    }
    std::istringstream iss(input);
    std::string cmd;
    iss >> cmd; // takes first argument and checks if the command is valid and exists
    std::transform(cmd.begin(), cmd.end(), cmd.begin(), ::toupper); // handles capital and non captial letters as equal
    if (commandMap.find(cmd) == commandMap.end()) {
        // does nothing
        return HandleError("");
    }
    std::string args;
    getline(iss, args);
    return cmd , args ; //return input seperated.
}

std::string ConsoleMenu::HandleError(const std::string&) {
    return ;
}