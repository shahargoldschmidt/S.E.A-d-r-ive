#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

// Reads one line of input from the configured input stream
std::string ConsoleMenu::getInput() {
    std::string userInput;
    std::getline(in, userInput);
    return userInput;
}

// Separates the command from the rest of the arguments in the input string
std::pair<std::string,std::string> ConsoleMenu::seperateInput(const std::string& userInput) {
    if (userInput.empty()) {
        return {"", ""};
    }
    std::istringstream iss(userInput);
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
