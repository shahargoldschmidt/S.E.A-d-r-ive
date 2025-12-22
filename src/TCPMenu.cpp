#include "TCPMenu.h"
#include <sys/socket.h>
#include <unistd.h>
#include <cstring>
#include <iostream>

using namespace std;

TCPMenu::TCPMenu(int socket) : m_socket(socket) {}

string TCPMenu::getInput() {
    char buffer[4096];
    memset(buffer, 0, sizeof(buffer));

    // reading from server until something is recieved
    int bytesRead = recv(m_socket, buffer, sizeof(buffer) - 1, 0);

    if (bytesRead <= 0) {
        return ""; // if client disconnectes
    }

    string input(buffer);

    return input;
}

void TCPMenu::respond(string message) {
    message += "\n";
    send(m_socket, message.c_str(), message.length(), 0); //sending response
}