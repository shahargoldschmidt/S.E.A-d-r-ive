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
    auto ci = menu.seperateInput("add file.txt mydata");
    EXPECT_EQ(ci.command, "ADD");
    // Test GET
    ci = menu.seperateInput("GET file.txt");
    EXPECT_EQ(ci.command, "GET");
    // Test SEARCH
    ci = menu.seperateInput("SeArCh abc");
    EXPECT_EQ(ci.command, "SEARCH");
}

// TEST 2: check that invalid commends dont return nothing
TEST(ConsoleMenuTests, IgnoresInvalidCommands) {
    // Invalid commands (wrong keyword or blank)
    auto ci = menu.seperateInput("REMOVE something");
    EXPECT_TRUE(ci.command.empty());
    ci = menu.seperateInput("");
    EXPECT_TRUE(ci.command.empty());
    ci = menu.seperateInput("67");
    EXPECT_TRUE(ci.command.empty());
}

/*TEST 3: check loop continues even after unvalid commands
TEST(ConsoleMenuTests, KeepsPromptingAfterEachInput) {
    std::vector<std::string> inputs = {"INVALID", "GET file", "SEARCH word", "ADD x y z", "FOO", "GET y"};
    int validCount = 0;
    for (const auto& inp : inputs) {
        auto ci = menu.seperateInput(inp);
        if (!ci.command.empty() && commands.count(ci.command)) {
            commands[ci.command]->execute(ci.args);
            validCount++;
        }
        // Simulates: loop continues regardless of previous result
    }
    EXPECT_EQ(validCount, 4); // Only 4 valid commands among 6 inputs
}*/  
