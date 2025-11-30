#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <thread>
#include <string>
#include "TCPMenu.h"

using namespace std;

class TCPMenuTest : public ::testing::Test {
protected:
    int socks[2]; // server and client

    void SetUp() override {
        // Create a pair of connected sockets (simulates a network connection)
        if (socketpair(AF_UNIX, SOCK_STREAM, 0, socks) < 0) {
            perror("socketpair");
            exit(1);
        }
    }

    void TearDown() override {
        close(socks[0]);
        close(socks[1]);
    }
};

// Check that Input is read correctly from the socket
TEST_F(TCPMenuTest, GetInputReadsFromSocket) {
    TCPMenu menu(socks[0]); // The Menu listens on side 0

    string message = "hello server";
    write(socks[1], message.c_str(), message.length());

    // The Menu should read this
    string result = menu.getInput();
    EXPECT_EQ(result, "hello server");
}

// Check that Respond writes correctly to the socket
TEST_F(TCPMenuTest, RespondWritesToSocket) {
    TCPMenu menu(socks[0]);

    // The Menu sends a response
    menu.respond("Welcome");
    char buffer[1024] = {0};
    read(socks[1], buffer, sizeof(buffer));

    // Expect to see the message + newline (as implemented in respond)
    EXPECT_STREQ(buffer, "Welcome\n");
}

// Test client disconnection
TEST_F(TCPMenuTest, HandlesClientDisconnect) {
    TCPMenu menu(socks[0]);
    
    // Close the Client side
    close(socks[1]); 

    // The Menu should detect that the other side closed and return an empty string
    string result = menu.getInput();
    EXPECT_EQ(result, ""); 
}