#ifndef COMMANDINPUT_H
#define COMMANDINPUT_H

#include <string>


// Putting the command parts into one easy package
struct CommandInput {
    std::string command; // The main thing the user typed
    std::string args; // Everything after the command
};

#endif