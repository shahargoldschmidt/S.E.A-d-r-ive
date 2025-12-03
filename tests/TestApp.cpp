#include <gtest/gtest.h>
#include <stdexcept>
#include <string>
#include <vector>
#include <map>

#include "App.h"
#include "IMenu.h"
#include "ICommand.h"

using namespace std;

// Fake Menu
class FakeMenu : public IMenu {
public:
    vector<string> inputs;  
    int index = 0;
    string lastResponse; // To capture what App sends back

    string getInput() override {
        if (index >= inputs.size()) {
            throw runtime_error("stop");
        }
        return inputs[index++];
    }

    void respond(string message) override {
        lastResponse = message;
    }
};

// Fake Command 
class FakeCommand : public ICommand {
public:
    int callCount = 0;
    string lastArg;
    string returnVal; // What this command should return

    FakeCommand(string ret = "OK") : returnVal(ret) {}

    string execute(const string& arg) override {
        callCount++;
        lastArg = arg;
        return returnVal;
    }
};

// Command that throws 
class ThrowingCommand : public ICommand {
public:
    int callCount = 0;

    // Changed return type from void to string to match ICommand interface
    string execute(const string&) override {
        callCount++;
        throw runtime_error("command failed");
        return ""; // Unreachable, but required for compilation
    }
};

// App executes a valid command correctly tests
TEST(AppTests, ExecutesValidCommand)
{
    FakeMenu menu;
    FakeCommand* cmd = new FakeCommand("200 Ok"); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { "add file1.txt" };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    
    EXPECT_EQ(cmd->callCount, 1); 
    EXPECT_EQ(cmd->lastArg, "file1.txt"); 
    EXPECT_EQ(menu.lastResponse, "200 Ok"); // Verify App sent the response to menu
}

// App skips an empty command 
TEST(AppTests, SkipsEmptyCommand)
{
    FakeMenu menu;
    FakeCommand* cmd = new FakeCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { " " };  // should be handled as bad request

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);
    
    EXPECT_EQ(cmd->callCount, 0); 
    EXPECT_EQ(menu.lastResponse, "400 Bad Request1"); 
}

// Command throws but App continues running 
TEST(AppTests, CommandThrowsButAppContinues)
{
    FakeMenu menu;
    ThrowingCommand* cmd = new ThrowingCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { "add X" };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    //went into execute function
    EXPECT_EQ(cmd->callCount, 1);
}

// Two valid commands in sequence
TEST(AppTests, TwoValidCommands)
{
    FakeMenu menu;
    FakeCommand* cmd1 = new FakeCommand("Res1"); 
    FakeCommand* cmd2 = new FakeCommand("Res2"); 

    map<string, ICommand*> commands = {
        {"add", cmd1},
        {"get", cmd2}
    };

    menu.inputs = { "add file1.txt", "get file2.txt" };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    EXPECT_EQ(cmd1->callCount, 1);
    EXPECT_EQ(cmd1->lastArg, "file1.txt");

    EXPECT_EQ(cmd2->callCount, 1);
    EXPECT_EQ(cmd2->lastArg, "file2.txt");
    
    // Since run() loops, lastResponse will be from the last command
    EXPECT_EQ(menu.lastResponse, "Res2");
}

// Test for seprate the input
TEST(AppTests, SeperateInputLogic) {
    FakeMenu menu;
    FakeCommand* cmd = new FakeCommand();
    
    // We register "add" so the App knows it's valid
    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    App app(&menu, commands);

    // Test Valid Command with Arguments
    // "ADD" should become "add", args should be "file.txt"
    auto result = app.seperateInput("ADD file.txt");
    EXPECT_EQ(result.command, "add");
    EXPECT_EQ(result.args, "file.txt");

    // Test Valid Command with extra spaces
    // Should parse correctly and trim leading space of args
    auto result2 = app.seperateInput("add   data");
    EXPECT_EQ(result2.command, "add");
    EXPECT_EQ(result2.args, "  data"); // Assuming your logic keeps internal spaces but trims the first separator

    // Test Invalid Command (Not in map)
    // "delete" is not in our map, so it should return empty
    auto result3 = app.seperateInput("delete file.txt");
    EXPECT_TRUE(result3.command.empty());
    
    // Test Empty Input
    auto result4 = app.seperateInput("");
    EXPECT_TRUE(result4.command.empty());

    // Test Case Insensitivity
    auto result5 = app.seperateInput("AdD x");
    EXPECT_EQ(result5.command, "add");
}