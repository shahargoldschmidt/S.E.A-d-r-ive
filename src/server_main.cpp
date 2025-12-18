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
#include "DeleteCommand.h"
#include "ClientHandler.h"
#include "OSFileHandler.h"
#include "RLEStrategy.h"
#include "UpdateFileCommand.h"
#include "ThreadPool.h"

#include "IFileHandler.h"
#include "ICompressor.h"

using namespace std;

int main(int argc, char *argv[])
{

    // We expect exactly 2 arguments the program name and port
    if (argc != 2)
    {
        cerr << "Usage: " << argv[0] << " <port>" << endl;
        return 1;
    }

    int serverPort = atoi(argv[1]);

    // Load ThreadPool size from environment (docker-compose)
    const char* envThreads = getenv("THREAD_POOL_SIZE");
    if (!envThreads)
    {
        cerr << "Error: THREAD_POOL_SIZE not defined in environment!" << endl;
        return 1;
    }

    int poolSize = atoi(envThreads);
    if (poolSize <= 0)
    {
        cerr << "Error: THREAD_POOL_SIZE must be a positive integer!" << endl;
        return 1;
    }

    ThreadPool pool(poolSize);


    // Initialize Shared Resources
    IFileHandler *fileHandler = new OSFileHandler();
    ICompressor *compressor = new RLEStrategy();

    // create commands
    ICommand *addCmd = new AddFileCommand(fileHandler, compressor);
    ICommand *getCmd = new GetCommand(fileHandler, compressor);
    ICommand *searchCmd = new SearchCommand(fileHandler, compressor);
    ICommand *deleteCmd = new DeleteCommand(fileHandler);
    ICommand *updateCmd = new UpdateFileCommand(fileHandler, compressor); // Added update command

    // put commands in a map
    map<string, ICommand *> *commands = new map<string, ICommand *>();
    (*commands)["post"] = addCmd;
    (*commands)["get"] = getCmd;
    (*commands)["search"] = searchCmd;
    (*commands)["delete"] = deleteCmd;
    (*commands)["patch"] = updateCmd; // Register update command

    ThreadPool pool(10);

    // Create the Server Socket with IPv4 and TCP
    int serverSock = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSock < 0)
    {
        perror("Error creating socket");
        return 1;
    }

    // Configure Server Address Struct
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY; // Listen on all network interfaces
    serverAddr.sin_port = htons(serverPort); // Convert port to network byte order

    // Bind the socket to the IP and Port
    if (bind(serverSock, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        perror("Error binding");
        return 1;
    }

    // Start Listening
    if (listen(serverSock, 10) < 0)
    {
        perror("Error listening");
        return 1;
    }

    // Accept Loop
    while (true)
    {
        struct sockaddr_in clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);

        // The server blocks here until a client connects
        int clientSock = accept(serverSock, (struct sockaddr *)&clientAddr, &clientAddrLen);

        if (clientSock < 0)
        {
            perror("Error accepting client");
            continue; // Try to accept the next client
        }

        // Submit client handling as a task to the thread pool
        pool.submit([clientSock, commands]()
                    { clientHandler(clientSock, commands); });
    }

    // Server Cleanup
    close(serverSock);

    // Clean up command memory
    for (auto const &[key, val] : *commands)
    {
        delete val;
    }
    delete commands;
    delete fileHandler;
    delete compressor;

    return 0;
}