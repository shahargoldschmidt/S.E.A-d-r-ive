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
#include "AddFileCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "ClientHandler.h"

#include "IFileHandler.h" 
#include "ICompressor.h" 

using namespace std;

int main(int argc, char* argv[]) {
    
    // Parse the port number from the command line argument
    int serverPort = atoi(argv[1]);

    // Initialize Shared Resources 
    IFileHandler* fileHandler = new OsFileHandler(); // Uncomment when you have this class
    ICompressor* compressor = new RLEStrategy();

    // create commands
    ICommand* addCmd = new AddFileCommand(fileHandler, compressor);
    ICommand* getCmd = new GetCommand(fileHandler, compressor);
    ICommand* searchCmd = new SearchCommand(fileHandler, compressor);

    // put commands in a map
    map<string, ICommand*>* commands = new map<string, ICommand*>();
    (*commands)["post"] = addCmd;
    (*commands)["get"] = getCmd;
    (*commands)["search"] = searchCmd;

    //Create the Server Socket (IPv4, TCP)
    int serverSock = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSock < 0) {
        perror("Error creating socket");
        return 1;
    }

    // Configure Server Address Struct
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY; // Listen on all network interfaces
    serverAddr.sin_port = htons(serverPort); // Convert port to network byte order

    // Bind the socket to the IP and Port
    if (bind(serverSock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Error binding");
        return 1;
    }

    // Start Listening
    if (listen(serverSock, 10) < 0) {
        perror("Error listening");
        return 1;
    }

    // Accept Loop
    while (true) {
        struct sockaddr_in clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);
        
        // The server blocks here until a client connects
        int clientSock = accept(serverSock, (struct sockaddr*)&clientAddr, &clientAddrLen);
        
        if (clientSock < 0) {
            perror("Error accepting client");
            continue; // Try to accept the next client
        }

        thread clientThread(clientHandler, clientSock, commands); // client handler and its arguments
        clientThread.detach();
    }

    //Server Cleanup
    close(serverSock);
    
    // Clean up command memory
    for (auto const& [key, val] : *commands) {
        delete val;
    }
    delete commands;
    delete fileHandler;
    delete compressor;
    
    return 0;
}