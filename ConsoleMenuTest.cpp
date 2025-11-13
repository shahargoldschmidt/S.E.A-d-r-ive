#include "gtest/gtest.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include <map>
#include <string>

// command examples to use in tests
class MockCommand : public ICommand {
public:
    int called = 0;
    std::string lastArgs;
    void execute(const std::string& args) override {
        called++;
        lastArgs = args;
    }
};
// the commands necessary for ths part of the assigment 
MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {{"ADD", &add}, {"GET", &get}, {"SEARCH", &search}};
    ConsoleMenu menu(commands);

// TEST 1: check that valid commands are seperated correctly and returned. 
TEST(ConsoleMenuTests, ExecutesValidCommands) {
    // Test ADD (case-insensitive)
    auto ci = menu.getCommandInput("add file.txt mydata");
    EXPECT_EQ(ci.command, "ADD");
    // Test GET
    ci = menu.getCommandInput("GET file.txt");
    EXPECT_EQ(ci.command, "GET");
    // Test SEARCH
    ci = menu.getCommandInput("SeArCh abc");
    EXPECT_EQ(ci.command, "SEARCH");
}

// TEST 2: check that invalid commends dont return nothing
TEST(ConsoleMenuTests, IgnoresInvalidCommands) {
    // Invalid commands (wrong keyword or blank)
    auto ci = menu.getCommandInput("REMOVE something");
    EXPECT_TRUE(ci.command.empty());
    ci = menu.getCommandInput("");
    EXPECT_TRUE(ci.command.empty());
    ci = menu.getCommandInput("67");
    EXPECT_TRUE(ci.command.empty());
}
