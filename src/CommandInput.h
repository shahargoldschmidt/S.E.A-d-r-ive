#ifndef COMMANDINPUT_H
#define COMMANDINPUT_H

#include <string>


// Put the command parts into one easy package
struct CommandInput {
    std::string command; // The command the user typed
    std::string args; // Everything after the command - the file name and content
};

#endif