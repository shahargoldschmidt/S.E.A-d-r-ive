#include "gtest/gtest.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include <map>
#include <string>

class MockCommand : public ICommand {
public:
    void execute(const std::string&) override {}
};

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



// TEST 1: check users input recieves corectly
TEST(ConsoleMenuTests, GetInputReadsSingleLineCommands) {
    // the commands necessary for ths test 
    MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {
        {"ADD", &add}, {"GET", &get}, {"SEARCH", &search}
    };
    std::istringstream input("ADD file1.txt abc\nGET file1.txt\nSEARCH abc\n");
    ConsoleMenu menu(input, commands);
    std::string line1 = menu.getInput();
    EXPECT_EQ(line1, "ADD file1.txt abc");
    std::string line2 = menu.getInput();
    EXPECT_EQ(line2, "GET file1.txt");
    std::string line3 = menu.getInput();
    EXPECT_EQ(line3, "SEARCH test");
    // Should be empty after all input is consumed
    std::string line4 = menu.getInput();
    EXPECT_EQ(line4, "");
}


// TEST 2: check that valid commands are seperated correctly and returned. 
TEST(ConsoleMenuTests, ExecutesValidCommands) {
    // the commands necessary for ths test 
    MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {
        {"ADD", &add}, {"GET", &get}, {"SEARCH", &search}
    }
    std::istringstream dummyInput;
    ConsoleMenu menu(dummyInput, commands);
    // Test ADD 
    auto ci = menu.seperateInput("add file.txt mydata");
    EXPECT_EQ(ci.command, "ADD");
    EXPECT_EQ(ci.args, " file.txt mydata");
    // Test GET
    ci = menu.seperateInput("GET file.txt");
    EXPECT_EQ(ci.command, "GET");
    EXPECT_EQ(ci.args, " file.txt");
    // Test SEARCH
    ci = menu.seperateInput("SeArCh abc");
    EXPECT_EQ(ci.command, "SEARCH");
    EXPECT_EQ(ci.args, " abc");
}

// TEST 3: check that invalid commends dont return nothing
TEST(ConsoleMenuTests, IgnoresInvalidCommands) {
// the commands necessary for ths test 
    MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {
        {"ADD", &add}, {"GET", &get}, {"SEARCH", &search}
    }
    std::istringstream dummyInput;
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

/*TEST 4: check loop continues even after unvalid commands
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
