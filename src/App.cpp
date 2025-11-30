#include "App.h"
#include "IMenu.h"
#include "ICommand.h"
#include "CommandInput.h"
#include <map>
#include <string>
#include <iostream>
#include <algorithm>
#include "IMenu.h"
#include <string>
#include <map>
#include "ICommand.h"
#include <vector>
#include <sstream>

using namespace std;

// The constructor for the app running
App::App(IMenu *menu, const map<string, ICommand *> &commands)
    : menu(menu), commands(commands) {}

// Main loop of the application
void App::run()
{
    while (true)
    {
        // Get the next command splitted into command + args)
        string userInput = menu->getInput();
        auto userCom = seperateInput(userInput);
        
        // Skip if no command was entered
        if (userCom.command.empty()){
            menu->respond("400 Bad Request1");
            continue;
        }
        string response = "";
        try
        {
            response=commands[userCom.command]->execute(userCom.args); // Execute the command
        }
        catch (...)
        {
            continue; // Ignore exceptions and continue the loop
        }
        menu->respond(response);
    }
};


// Separates the command from the rest of the arguments in the users input
CommandInput App::seperateInput(const string& userInput) {
    if (userInput.empty() || isspace(userInput[0])) {
        return {"", ""};
    }
    istringstream iss(userInput); // create stream to seperate input
    string cmd;
    iss >> cmd; // get first word ,the command, from input
    transform(cmd.begin(), cmd.end(), cmd.begin(), ::tolower); // make case unsensitive
    if (commands.find(cmd) == commands.end()) {
        return {"",""};
    }
    string args;
    getline(iss, args); //get rest of the input
    if (!args.empty()) args.erase(0, 1); // erase space before sending
    return {cmd, args};
}