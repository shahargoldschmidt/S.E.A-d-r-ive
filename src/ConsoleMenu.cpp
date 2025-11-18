#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>
#include "CommandInput.h"

// gets users input and returns the splitted input to command and its content
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
    getline(iss, args); //get rest of the input
    if (!args.empty()) args.erase(0, 1); // erase space before sending
    return {cmd, args};
}
