#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>
#include "CommandInput.h"

// Reads one line of input from the input stream
CommandInput ConsoleMenu::getInput() {
    std::string userInput;
    std::getline(in, userInput);
    auto seperatedInput= seperateInput(userInput);
    return { seperatedInput.command, seperatedInput.args };
}

// Separates the command from the rest of the arguments in the users input
CommandInput ConsoleMenu::seperateInput(const std::string& userInput) {
    if (userInput.empty()) {
        return {"", ""};
    }
    std::istringstream iss(userInput); // create stream to seperate input
    std::string cmd;
    iss >> cmd; // get first word ,the command, from input
    std::transform(cmd.begin(), cmd.end(), cmd.begin(), ::tolower); // make case unsensitive
    if (commandMap.find(cmd) == commandMap.end()) {
        return {"",""};
    }
    std::string args;
    getline(iss, args);
     args.erase(0, 1); // erase space before sending
    return {cmd, args};
}
