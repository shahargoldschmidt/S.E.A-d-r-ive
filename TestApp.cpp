#include <gtest/gtest.h>
#include <stdexcept>
#include <string>
#include <vector>
#include <map>

#include "App.h"
#include "IMenu.h"
#include "ICommand.h"

//
// ---------- Fake Menu (updated for new IMenu) ----------
//   IMenu now returns:  pair<string,string>
//   so FakeMenu must match that.
//
class FakeMenu : public IMenu {
public:
    std::vector<std::pair<std::string,std::string>> inputs;  // {command, args}
    int index = 0;

    std::pair<std::string,std::string> getInput() override {
        if (index >= inputs.size()) {
            // Stop the infinite loop inside App::run
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
// ---------- Fake Command that throws ----------
//
class ThrowingCommand : public ICommand {
public:
    int callCount = 0;

    void execute(const std::string&) override {
        callCount++;
        throw std::runtime_error("command failed");
    }
};

//
// =================================================
//                  TESTS FOR APP
// =================================================
//

//
// --- TEST 1: App calls the correct ICommand with correct arguments ---
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

    EXPECT_THROW(app.run(), std::runtime_error);  // Stop after inputs end

    EXPECT_EQ(cmd.callCount, 1);
    EXPECT_EQ(cmd.lastArg, " file1.txt");
}

//
// --- TEST 2: App must SKIP an empty command ---
//
TEST(AppTests, SkipsEmptyCommand)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = { {"", ""} };  // Parser failed → should be ignored

    App app(&menu, commands);

    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 0); // skip – execute must NOT run
}

//
// --- TEST 3: Command throws but App continues ---
//
TEST(AppTests, CommandThrowsButAppContinues)
{
    FakeMenu menu;
    ThrowingCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = { {"add", " X"} };

    App app(&menu, commands);

    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 1); // execute ran once even though it threw
}

//
// --- TEST 4: Multiple inputs in sequence ---
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

    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 2); // two valid executions
}
