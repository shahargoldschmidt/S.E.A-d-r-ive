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
        {"add", &add}, {"get", &get}, {"search", &search}
    };
    std::istringstream input("add file1.txt abc\nget file1.txt\nsearch abc\n");
    ConsoleMenu menu(input, commands);
    std::string line1 = menu.getInput();
    EXPECT_EQ(line1, "add file1.txt abc");
    std::string line2 = menu.getInput();
    EXPECT_EQ(line2, "get file1.txt");
    std::string line3 = menu.getInput();
    EXPECT_EQ(line3, "search test");
    // Should be empty after all input is consumed
    std::string line4 = menu.getInput();
    EXPECT_EQ(line4, "");
}


// TEST 2: check that valid commands are separated correctly and returned.
TEST(ConsoleMenuTests, ExecutesValidCommands) {
    MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {
        {"add", &add}, {"get", &get}, {"search", &search}
    };
    std::istringstream input("");
    ConsoleMenu menu(input, commands);
    // Test ADD checking sentistive letters
    auto ci = menu.seperateInput("ADD file.txt mydata");
    EXPECT_EQ(ci.first, "add");
    EXPECT_EQ(ci.second, "file.txt mydata");
    // Test GET
    ci = menu.seperateInput("get file.txt");
    EXPECT_EQ(ci.first, "get");
    EXPECT_EQ(ci.second, "file.txt");
    // Test SEARCH
    ci = menu.seperateInput("SeArCh abc");
    EXPECT_EQ(ci.first, "search");
    EXPECT_EQ(ci.second, "abc");
}

// TEST 3: check that invalid commands don't return anything
TEST(ConsoleMenuTests, IgnoresInvalidCommands) {
    MockCommand add, get, search;
    std::map<std::string, ICommand*> commands = {
        {"add", &add}, {"get", &get}, {"search", &search}
    };
    std::istringstream dummyInput("");
    ConsoleMenu menu(dummyInput, commands);
    // Invalid commands (wrong keyword or blank)
    auto ci = menu.seperateInput("REMOVE something");
    EXPECT_TRUE(ci.first.empty());
    EXPECT_TRUE(ci.second.empty());
    ci = menu.seperateInput("");
    EXPECT_TRUE(ci.first.empty());
    EXPECT_TRUE(ci.second.empty());
    ci = menu.seperateInput("67");
    EXPECT_TRUE(ci.first.empty());
    EXPECT_TRUE(ci.second.empty());
}

