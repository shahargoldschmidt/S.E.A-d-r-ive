#include <iostream>
#include <thread>
#include <sys/socket.h> // Core socket functions (socket, bind, listen, accept)
#include <netinet/in.h> // Structures for storing address information
#include <unistd.h>     // For close()
#include <map>          // std::map container
#include <string>
#include "App.h"
#include "TCPMenu.h"
#include "ICommand.h"

// Command implementations
//#include "Commands/PostCommand.h"
//#include "Commands/DeleteCommand.h"

// File Handler implementation
// #include "IO/OsFileHandler.h" 

using namespace std;

/**
 * This function runs in a separate thread for EACH connected client.
 * It is responsible for setting up the specific environment for the client
 *  and running the logic loop.
 */
void clientHandler(int clientSock, map<string, ICommand*>* CommandsMap) {
    //Create a Menu for this client with the socket
    IMenu* menu = new TCPMenu(clientSock);
    //Create the App for this client
    App myApp(menu, CommandsMap);
    myApp.run();
    //Cleanup resources for this specific client
    close(clientSock); // Close the network connection
    delete menu;       // Free memory allocated for the menu
}


int main(int argc, char* argv[]) {
    
    // Parse the port number from the command line argument
    int serverPort = atoi(argv[1]);

    // Initialize Shared Resources 
    IFileHandler* fileHandler = new OsFileHandler(); // Uncomment when you have this class

    map<string, ICommand*>* globalCommandMap = new map<string, ICommand*>();


    // =============================================================
    // Step B: Network Setup (TCP Layer)
    // =============================================================

    // 1. Create the Server Socket (IPv4, TCP)
    int serverSock = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSock < 0) {
        perror("Error creating socket");
        return 1;
    }

    // 2. Configure Server Address Struct
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY; // Listen on all network interfaces
    serverAddr.sin_port = htons(serverPort); // Convert port to network byte order

    // 3. Bind the socket to the IP and Port
    if (bind(serverSock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Error binding");
        return 1;
    }

    // 4. Start Listening (Queue size = 10)
    if (listen(serverSock, 10) < 0) {
        perror("Error listening");
        return 1;
    }

    cout << "Server is listening on port " << serverPort << "..." << endl;

    // =============================================================
    // Step C: Main Accept Loop (Infinite)
    // =============================================================
    while (true) {
        struct sockaddr_in clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);
        
        // The server blocks here until a client connects
        int clientSock = accept(serverSock, (struct sockaddr*)&clientAddr, &clientAddrLen);
        
        if (clientSock < 0) {
            perror("Error accepting client");
            continue; // Try to accept the next client
        }

        cout << "Client connected!" << endl;

        [cite_start]// Requirement: "The server handles each client using a separate thread" [cite: 43]
        // We pass the new client socket and the shared command map.
        thread clientThread(clientHandler, clientSock, globalCommandMap);
        
        [cite_start]// Requirement: "The server creates a new thread for each client" (No thread pool) [cite: 85]
        // We detach the thread so it runs independently and releases resources when done.
        clientThread.detach();
    }

    // =============================================================
    // Step D: Server Cleanup (Only reached if loop breaks)
    // =============================================================
    close(serverSock);
    
    // Clean up command memory
    for (auto const& [key, val] : *globalCommandMap) {
        delete val;
    }
    delete globalCommandMap;
    // delete fileHandler;
    
    return 0;
}