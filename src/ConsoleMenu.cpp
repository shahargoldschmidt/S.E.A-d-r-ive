#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

using namespace std;

// Implements console based menu for user input
ConsoleMenu::ConsoleMenu(std::istream& input, const std::map<std::string, ICommand*>& cmds)
    : in(input), commandMap(cmds) {}

// gets users input and returns the splitted input to command and its content
string ConsoleMenu::getInput() {
    string userInput;
    
    // getline reads the entire line until the user hits Enter.
    if (!getline(cin, userInput)) {
        return ""; 
    }
    
    return userInput;
}
void ConsoleMenu::respond(string message) {
    // Simply print the message followed by a newline
    cout << message << endl;
}
