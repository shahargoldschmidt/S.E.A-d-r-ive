#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>
#include "CommandInput.h"
using std::string;

// This class runs commands from a menu
class App
{
private:
    IMenu *menu;                                // Interface for getting input
    std::map<std::string, ICommand *> commands; // Map of command strings

public:
    App(IMenu *menu, const std::map<std::string, ICommand *> &commands); // The constructor

    // Copy Constructor.
    App(const App &) = delete;
    // Copy Assignment Operator.
    App &operator=(const App &) = delete;

    void run(); // infinite loop
    CommandInput seperateInput(const string &userInput);
};

#endif