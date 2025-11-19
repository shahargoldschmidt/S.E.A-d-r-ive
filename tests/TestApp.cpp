#include <gtest/gtest.h>
#include <stdexcept>
#include <string>
#include <vector>
#include <map>

#include "App.h"
#include "IMenu.h"
#include "ICommand.h"

//
// ---------- Fake Menu (updated for CommandInput struct) ----------
//
class FakeMenu : public IMenu {
public:
    std::vector<CommandInput> inputs;  
    int index = 0;

    CommandInput getInput() override {
        if (index >= inputs.size()) {
            throw std::runtime_error("stop");
        }
        return inputs[index++];
    }
};

//
// ---------- Fake Command (records calls) ----------
//
class FakeCommand : public ICommand {
public:
    int callCount = 0;
    std::string lastArg;

    void execute(const std::string& arg) override {
        callCount++;
        lastArg = arg;
    }
};

//
// ---------- Command that throws ----------
//
class ThrowingCommand : public ICommand {
public:
    int callCount = 0;

    void execute(const std::string&) override {
        callCount++;
        throw std::runtime_error("command failed");
    }
};


// --- TEST 1: App executes a valid command correctly ---
//
TEST(AppTests, ExecutesValidCommand)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = { {"add", " file1.txt"} };

    App app(&menu, commands);

    // Stop App::run() after inputs finish (FakeMenu throws to exit infinite loop)
    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 1);
    EXPECT_EQ(cmd.lastArg, " file1.txt");
}

//
// --- TEST 2: App skips an empty command ---
//
TEST(AppTests, SkipsEmptyCommand)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = { {"", ""} };  // should be skipped

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), std::runtime_error);

    //no execute function at all.
    EXPECT_EQ(cmd.callCount, 0); 
}

//
// --- TEST 3: Command throws but App continues running ---
//
TEST(AppTests, CommandThrowsButAppContinues)
{
    FakeMenu menu;
    ThrowingCommand cmd;//going to throw an erreo

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = { {"add", " X"} };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), std::runtime_error);

    //went into execute function
    EXPECT_EQ(cmd.callCount, 1);
}

//
// --- TEST 4: Two valid commands in sequence ---
//
TEST(AppTests, MultipleInputs)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = {
        {"add", " A"},
        {"add", " B"}
    };

    App app(&menu, commands);

    // Stop App::run() after inputs finish 
    EXPECT_THROW(app.run(), std::runtime_error);

    //called 2 time to the execute function
    EXPECT_EQ(cmd.callCount, 2);
}
