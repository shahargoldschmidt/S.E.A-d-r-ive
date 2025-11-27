#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include <cstring>

// Include the custom menu class (handles user I/O via console)
#include "ConsoleMenu.h"

using namespace std;

int main(int argc, char* argv[]) {
    // 1. Validate command-line arguments (program must get IP and Port)
    if (argc < 3) {
        cerr << "Usage: " << argv[0] << " <ip> <port>" << endl;
        return 1;
    }

    // Extract server IP and port from CLI arguments
    const char* server_ip = argv[1];
    int server_port = atoi(argv[2]);

    // 2. Create a TCP socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("Error creating socket");
        return 1;
    }

    // 3. Define server address structure
    struct sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;             // IPv4
    serverAddr.sin_port = htons(server_port);    // Convert port to network byte order
    
    // Convert IP string to binary format (validate IP format)
    if (inet_pton(AF_INET, server_ip, &serverAddr.sin_addr) <= 0) {
        perror("Invalid address / Address not supported");
        return 1;
    }

    if (connect(sock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Connection failed");
        return 1;
    }
    
    // 5. Create a ConsoleMenu object to handle user input/output
    ConsoleMenu menu; 

    while (true) {
        // Get user input from console using the menu
        string userInput = menu.getInput();
        
        // If input is empty (e.g., Ctrl+D), exit loop
        //if (userInput.empty()) break;

        // Append newline (protocol requirement)
        //userInput += "\n";

        // Send the command to the server
        int sentBytes = send(sock, userInput.c_str(), userInput.length(), 0);
        if (sentBytes < 0) {
            menu.respond("Error sending data");
            break;
        }

        // Prepare buffer to receive server response
        char buffer[4096];
        memset(buffer, 0, sizeof(buffer));
        int readBytes = recv(sock, buffer, sizeof(buffer) - 1, 0);
        
        // If server disconnected or error occurred
        if (readBytes <= 0) {
            menu.respond("Server disconnected");
            break;
        }

        // Convert buffer to string using the exact number of bytes read
        string serverResponse(buffer, readBytes);
        
        // Optional: remove trailing newline character (cosmetic)
        if (!serverResponse.empty() && serverResponse.back() == '\n') {
            serverResponse.pop_back();
        }

        // Display server response through menu
        menu.respond(serverResponse);
    }

    // 6. Close socket connection
    close(sock);
    return 0;
}
