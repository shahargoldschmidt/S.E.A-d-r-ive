#include "App.h"
#include "IMenu.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <map>
#include <string>
#include <iostream>

class App {
private:
    IMenu* menu;
    std::map<std::string, ICommand*> commands;

public:
    App(IMenu* menu, const std::map<std::string, ICommand*>& commands)
        : menu(menu), commands(commands) {}

    void run() {
        while (true) {
            //get the users input
            std::string input = menu->getInput();
            //seperate the command and its content
            auto userCom = menu->seperateInput(input); 
            if (userCom.first.empty())
                continue;
            try {
                commands[userCom.first]->execute(userCom.second); 
            } catch (...) {
                continue;
            }
        }
    }
};