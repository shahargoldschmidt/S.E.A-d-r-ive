#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>

class App {
private:
    IMenu* menu;  
    std::map<std::string, ICommand*> commands;  

public:
    App(IMenu* menu, const std::map<std::string, ICommand*>& commands);

    void run();  // infinite loop
};

#endif
