#include "ConsoleMenu.h"
#include <iostream>
#include <algorithm>
#include <sstream>

using namespace std;

// Implements console based menu for user input
ConsoleMenu::ConsoleMenu() {}

// gets users input
string ConsoleMenu::getInput() {
    string userInput;
    
    // getline reads the entire line until the user hits Enter.
    if (!getline(cin, userInput)) {
        return ""; 
    }
    
    return userInput;
}
// prints users output
void ConsoleMenu::respond(string message) {
    // Simply print the message followed by a newline
    cout << message << endl;
}
