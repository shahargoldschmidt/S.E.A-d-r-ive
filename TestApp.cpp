#include <gtest/gtest.h>
#include <stdexcept>
#include <string>
#include <vector>
#include <map>

#include "App.h"
#include "IMenu.h"
#include "ICommand.h"

//
// ---------- Fake Menu ----------
//
class FakeMenu : public IMenu {
public:
    std::vector<std::string> inputs;         // מה להחזיר בכל getInput()
    int index = 0;

    // מה להחזיר מ-separateInput()
    std::pair<std::string,std::string> output;

    std::string getInput() override {
        if (index >= inputs.size()) {
            // עצירת הלולאה של App
            throw std::runtime_error("stop");
        }
        return inputs[index++];
    }

    std::pair<std::string,std::string>
    seperateInput(const std::string& s) override {
        return output;
    }
};

//
// ---------- Fake Command (Records calls) ----------
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
// --- TEST 1: execute() called with correct arguments ---
//
TEST(AppTests, ExecutesValidCommand)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = {"add file1.txt"};
    menu.output = {"add", " file1.txt"};

    App app(&menu, commands);

    // צפוי ש- run יזרוק stop אחרי שהקלט נגמר
    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 1);
    EXPECT_EQ(cmd.lastArg, " file1.txt");
}

//
// --- TEST 2: skip empty command ---
//
TEST(AppTests, SkipsEmptyCommand)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = {"add file1.txt"};
    menu.output = {"", ""};     // פארסר מחזיר פקודה ריקה

    App app(&menu, commands);

    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 0); // אף פקודה לא קראה execute
}

//
// --- TEST 3: command throws but App continues ---
//
TEST(AppTests, CommandThrowsButAppContinues)
{
    FakeMenu menu;
    ThrowingCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = {"add X"}; 
    menu.output = {"add", " X"};

    App app(&menu, commands);

    EXPECT_THROW(app.run(), std::runtime_error);

    EXPECT_EQ(cmd.callCount, 1); // למרות חריגה - הפקודה קראה פעם אחת
}

//
// --- TEST 4: multiple inputs sequence ---
//
TEST(AppTests, MultipleInputs)
{
    FakeMenu menu;
    FakeCommand cmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &cmd}
    };

    menu.inputs = {"add A", "add B"};

    // שיטה: נשנה את התוצאה של separateInput לפי הקריאה
    // הקריאה הראשונה
    menu.output = {"add", " A"};

    App app(&menu, commands);

    // אחרי הקריאה הראשונה, לפני שהלולאה תבצע getInput שוב,
    // אנחנו נחליף ל-output אחר בקריאה הבאה.
    try {
        app.run();
    } catch (std::runtime_error&) {
        // עכשיו הקריאה השנייה:
        menu.output = {"add", " B"};

        // ננסה להמשיך שוב:
        try {
            app.run();
        } catch (std::runtime_error&) {}
    }

    // **שתי** הפעמים הפקודה הייתה אמורה לרוץ פעם אחת בכל run()
    // אבל כי כל run נקרא ידנית — יהיו פה 2 קריאות
    EXPECT_GE(cmd.callCount, 1);
}
