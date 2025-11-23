#include "App.h"
#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>
#include <iostream>
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
        auto userCom = menu->getInput();
        
        // Skip if no command was entered
        if (userCom.command.empty())
            continue;
        try
        {
            commands[userCom.command]->execute(userCom.args); // Execute the command
        }
        catch (...)
        {
            continue; // Ignore exceptions and continue the loop
        }
    }
};