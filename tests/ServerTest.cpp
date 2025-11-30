#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <thread>
#include <map>
#include "ClientHandler.h" // The new Header we created
#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"

using namespace std;

// Mock for Compressor
class ServerTestMockCompressor : public ICompressor {
public:
    string compress(const string& input) override { return "CMP_" + input; }
    string decompress(const string& input) override { return input; }
};

// Mock for File Handler
class ServerTestMockFileHandler : public IFileHandler {
public:
    void saveFile(const string& name, const string& content) override {} // Does nothing
    string readFile(const string& name) override { return ""; }
    vector<string> listFiles() override { return {}; }
    string getBasePath() override { return ""; }
    void removeFile(const std::string& fileName) override {}
};

// Mock for Command
class ServerTestMockCommand : public ICommand {
public:
    string execute(const string& args) override {
        return "200 Ok\nExecuted: " + args;
    }
};

class ServerFlowTest : public ::testing::Test {
protected:
    int socks[2]; 
    map<string, ICommand*> commands;
    ServerTestMockCommand* mockCmd;

    void SetUp() override {
        // Create socket pair (simulates network connection)
        socketpair(AF_UNIX, SOCK_STREAM, 0, socks);

        // Prepare command map for the server
        mockCmd = new ServerTestMockCommand();
        commands["testcmd"] = mockCmd;
    }

    void TearDown() override {
        // Cleanup
        delete mockCmd;
        close(socks[0]);
        close(socks[1]);
    }
};

// This test simulates a client connecting to the server and sending a command
TEST_F(ServerFlowTest, ServerRespondsToCommand) {
    // Run the ClientHandler in a separate thread (like a real server does)
    // We pass it socks[0]
    thread serverThread(clientHandler, socks[0], &commands);

    // We are the Client Send a command known to the server
    string commandToSend = "testcmd my_args";
    write(socks[1], commandToSend.c_str(), commandToSend.length());

    // Read the response from the server
    char buffer[1024] = {0};
    int bytesRead = read(socks[1], buffer, sizeof(buffer));

    // Verify that the server returned the correct response
    string expectedResponse = "200 Ok\nExecuted: my_args\n"; 
    
    // Convert buffer to string for comparison
    string actualResponse(buffer, bytesRead);
    
    EXPECT_EQ(actualResponse, expectedResponse);

    // Proactive disconnect to terminate the Thread
    close(socks[1]);
    serverThread.detach(); 
}