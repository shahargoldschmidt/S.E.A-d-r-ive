#ifndef CLIENTHANDLER_H
#define CLIENTHANDLER_H

#include <map>
#include <string>
#include "ICommand.h"

using namespace std;

// This function runs in a separate thread for EACH connected client
// It is responsible for setting up the environment for the client and running the logic loop.
void clientHandler(int clientSock, map<string, ICommand*>* CommandsMap);

#endif