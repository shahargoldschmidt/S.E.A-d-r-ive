#include "gtest/gtest.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include <map>
#include <string>
#include "CommandInput.h"
using namespace std;


// command examples to use in tests
class MockCommand : public ICommand {
public:
    int called = 0;
    string lastArgs;

    void execute(const string& args) override {
        called++;
        lastArgs = args;
    }
};


// TEST 1: check that valid commands are separated correctly and returned.
TEST(ConsoleMenuTests, ExecutesValidCommands) {
    MockCommand add, get, search;
    map<string, ICommand*> commands = {
        {"add", &add}, {"get", &get}, {"search", &search}
    };

    istringstream input("");
    ConsoleMenu menu(input, commands);

    // Test ADD checking sentistive letters
    auto ci = menu.seperateInput("ADD file.txt mydata");
    EXPECT_EQ(ci.command, "add");
    EXPECT_EQ(ci.args, "file.txt mydata");

    // Test GET
    ci = menu.seperateInput("get file.txt");
    EXPECT_EQ(ci.command, "get");
    EXPECT_EQ(ci.args, "file.txt");

    // Test SEARCH
    ci = menu.seperateInput("SeArCh abc");
    EXPECT_EQ(ci.command, "search");
    EXPECT_EQ(ci.args, "abc");
}

// TEST 2: check that invalid commands don't return anything
TEST(ConsoleMenuTests, IgnoresInvalidCommands) {
    MockCommand add, get, search;
    map<string, ICommand*> commands = {
        {"add", &add}, {"get", &get}, {"search", &search}
    };

    istringstream dummyInput("");
    ConsoleMenu menu(dummyInput, commands);

    // Invalid commands (wrong keyword or blank)
    auto ci = menu.seperateInput("REMOVE something");
    EXPECT_TRUE(ci.command.empty());
    EXPECT_TRUE(ci.args.empty());

    ci = menu.seperateInput("");
    EXPECT_TRUE(ci.command.empty());
    EXPECT_TRUE(ci.args.empty());

    ci = menu.seperateInput("67");
    EXPECT_TRUE(ci.command.empty());
    EXPECT_TRUE(ci.args.empty());
}
