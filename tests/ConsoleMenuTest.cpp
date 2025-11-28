#include "gtest/gtest.h"
#include "ConsoleMenu.h"
#include <string>
#include <sstream>
#include <iostream>

using namespace std;

// --- Test respond() ---
// Checks that the function prints exactly the message
TEST(ConsoleMenuTests, RespondPrintsToStdout) {
    ConsoleMenu menu;
    //capturing Standard Output
    testing::internal::CaptureStdout();
    menu.respond("Hello User");
    // retrieve the output string
    string output = testing::internal::GetCapturedStdout();
    // Assertion: The message must include a newline at the end (endl)
    EXPECT_EQ(output, "Hello User\n");
}

// --- Test getInput() ---
// Checks that the function reads a line from the user correctly
TEST(ConsoleMenuTests, GetInputReadsLineFromCin) {
    // mock user input
    stringstream mockInput("add file.txt\n");
    
    // Save the original buffer of cin to restore it later
    streambuf* origCin = cin.rdbuf();
    
    // Redirect cin to read from our mock stream instead of the keyboard
    cin.rdbuf(mockInput.rdbuf());

    ConsoleMenu menu;
    string result = menu.getInput();

    // Restore cin to its original state
    cin.rdbuf(origCin);

    EXPECT_EQ(result, "add file.txt");
}

// Edge Case: Check what happens when input is empty
TEST(ConsoleMenuTests, GetInputHandlesEmptyLine) {
    // Input containing only a newline
    stringstream mockInput("\n");
    
    streambuf* origCin = cin.rdbuf();
    cin.rdbuf(mockInput.rdbuf());

    ConsoleMenu menu;
    string result = menu.getInput();

    cin.rdbuf(origCin);

    EXPECT_EQ(result, "");
}