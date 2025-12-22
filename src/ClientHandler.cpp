#include "ClientHandler.h"
#include <iostream>
#include <unistd.h>
#include "App.h"
#include "TCPMenu.h"

using namespace std;

void clientHandler(int clientSock, map<string, ICommand*>* CommandsMap) {
    // Create a Menu for this client with the socket
    IMenu* menu = new TCPMenu(clientSock);
    // Create the App for this client
    App myApp(menu, *CommandsMap);
    myApp.run();
    // Cleanup resources for this specific client
    close(clientSock); // Close the network connection
    delete menu;       // Free menu memory 
}