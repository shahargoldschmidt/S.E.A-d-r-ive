#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

// Reads one line of input from the input stream
std::string ConsoleMenu::getInput() {
    std::string userInput;
    std::getline(in, userInput);
    return userInput;
}

// Separates the command from the rest of the arguments in the users input
std::pair<std::string,std::string> ConsoleMenu::seperateInput(const std::string& userInput) {
    if (userInput.empty()) {
        return {"", ""};
    }
    std::istringstream iss(userInput); // create stream to seperate input
    std::string cmd;
    iss >> cmd; // get first word ,the command, from input
    std::transform(cmd.begin(), cmd.end(), cmd.begin(), ::toupper); // make case unsensitive
    if (commandMap.find(cmd) == commandMap.end()) {
        return {"", ""};
    }
    std::string args;
    getline(iss, args);
    return {cmd, args};
}
