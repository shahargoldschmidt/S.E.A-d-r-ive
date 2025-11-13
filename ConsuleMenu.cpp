#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

std::string ConsoleMenu::getCommandInput() {
    std::string input;
    std::getline(std::cin, input);
    if (input.empty()) {
        // Call error handler, but show nothing for now
        return HandleError("");
    }
    std::istringstream iss(input);
    std::string cmd;
    iss >> cmd;
    std::transform(cmd.begin(), cmd.end(), cmd.begin(), ::toupper);
    if (commandMap.find(cmd) == commandMap.end()) {
        // Call error handler, but stay silent for now
        return HandleError("");
    }
    return input;
}

std::string ConsoleMenu::HandleError(const std::string&) {
    return ;
}