#include "App.h"
#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>
#include <iostream>
using namespace std;

App::App(IMenu *menu, const map<string, ICommand *> &commands)
    : menu(menu), commands(commands) {}


void App::run()
{
    while (true)
    {
        // Get the next command (already split into command + args)
        auto userCom = menu->getInput();
        // no command
        if (userCom.command.empty())
            continue;
        try
        {
            commands[userCom.command]->execute(userCom.args);
        }
        catch (...)
        {
            continue;
        }
    }
};