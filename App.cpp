#include "App.h"
#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>
#include <iostream>

App::App(IMenu *menu, const std::map<std::string, ICommand *> &commands)
    : menu(menu), commands(commands) {}

void App::run()
{
    while (true)
    {
        // get the users input
        // std::string input = menu->getInput();
        // seperate the command and its content
        auto userCom = menu->getInput();
        if (userCom.first.empty())
            continue;
        try
        {
            commands[userCom.first]->execute(userCom.second);
        }
        catch (...)
        {
            continue;
        }
    }
};