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
    vector<CommandInput> inputs;  
    int index = 0;

    CommandInput getInput() override {
        if (index >= inputs.size()) {
            throw runtime_error("stop");
        }
        return inputs[index++];
    }
};

// Fake Command 
class FakeCommand : public ICommand {
public:
    int callCount = 0;
    string lastArg;

    void execute(const string& arg) override {
        callCount++;
        lastArg = arg;
    }
};

// Command that throws 
class ThrowingCommand : public ICommand {
public:
    int callCount = 0;

    void execute(const string&) override {
        callCount++;
        throw runtime_error("command failed");
    }
};

//  App executes a valid command correctly tets
TEST(AppTests, ExecutesValidCommand)
{
    FakeMenu menu;
    FakeCommand* cmd = new FakeCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { {"add", " file1.txt"} };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    
    EXPECT_EQ(cmd->callCount, 1); 
    EXPECT_EQ(cmd->lastArg, " file1.txt");
}

// App skips an empty command 
TEST(AppTests, SkipsEmptyCommand)
{
    FakeMenu menu;
    FakeCommand* cmd = new FakeCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { {"", ""} };  // should be skipped

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    //no execute function at all.
    EXPECT_EQ(cmd->callCount, 0); 
}

// Command throws but App continues running 
TEST(AppTests, CommandThrowsButAppContinues)
{
    FakeMenu menu;
    ThrowingCommand* cmd = new ThrowingCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd}
    };

    menu.inputs = { {"add", " X"} };

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
    FakeCommand* cmd1 = new FakeCommand(); 
    FakeCommand* cmd2 = new FakeCommand(); 

    map<string, ICommand*> commands = {
        {"add", cmd1},
        {"get", cmd2}
    };

    menu.inputs = { {"add", " file1.txt"}, {"get", " file2.txt"} };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), runtime_error);

    EXPECT_EQ(cmd1->callCount, 1);
    EXPECT_EQ(cmd1->lastArg, " file1.txt");

    EXPECT_EQ(cmd2->callCount, 1);
    EXPECT_EQ(cmd2->lastArg, " file2.txt");
}