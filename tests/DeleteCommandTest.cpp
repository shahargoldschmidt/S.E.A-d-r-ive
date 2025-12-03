#include "gtest/gtest.h"
#include "DeleteCommand.h"
#include "IFileHandler.h"
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Fake handler
class FakeFileHandler : public IFileHandler {
public:
    vector<string> filesInStorage; // list of files
    bool wasRemoveCalled = false;  // did we call remove?
    string lastRemovedFile = "";   // name of file we tried to delete

    // Empty implementation for methods we are using
    string getBasePath() override { return ""; }
    void saveFile(const string& name, const string& content) override {}
    string readFile(const string& name) override { return ""; }

    // Return our fake list
    vector<string> listFiles() override {
        return filesInStorage;
    }

    // Simulate delete
    void removeFile(const string& fileName) override {
        wasRemoveCalled = true;
        lastRemovedFile = fileName;

        // Remove from vector
        auto it = std::find(filesInStorage.begin(), filesInStorage.end(), fileName);
        if (it != filesInStorage.end()) {
            filesInStorage.erase(it);
        }
    }
};

class DeleteCommandTest : public ::testing::Test {
protected:
    FakeFileHandler fakeHandler;
    DeleteCommand* command;

    void SetUp() override {
        command = new DeleteCommand(&fakeHandler);
    }

    void TearDown() override {
        delete command;
    }
};

TEST_F(DeleteCommandTest, Execute_Returns400_WhenArgsEmpty) {
    // empty input so error 400
    EXPECT_EQ(command->execute(""), "400 Bad Request");
}

TEST_F(DeleteCommandTest, Execute_Returns400_WhenLeadingSpace) {
    // space at start means bad parsing so error 400
    EXPECT_EQ(command->execute(" file.txt"), "400 Bad Request");
}

TEST_F(DeleteCommandTest, Execute_Returns400_WhenMultipleArgs) {
    // too many args so error 400
    EXPECT_EQ(command->execute("file1 file2"), "400 Bad Request");
}

TEST_F(DeleteCommandTest, Execute_Returns404_WhenFileNotInList) {
    // file missing from list
    fakeHandler.filesInStorage = {"other.txt", "data.dat"};
    fakeHandler.wasRemoveCalled = false;

    // try to delete missing file
    string result = command->execute("missing.txt");

    // should be 404 and no delete call
    EXPECT_EQ(result, "404 Not Found");
    EXPECT_FALSE(fakeHandler.wasRemoveCalled);
}

TEST_F(DeleteCommandTest, Execute_Returns204_AndRemovesFile_WhenFileExists) {
    string filename = "target.txt";

    // add file to our list
    fakeHandler.filesInStorage = {"a.txt", filename, "b.txt"};
    fakeHandler.wasRemoveCalled = false;

    // delete it
    string result = command->execute(filename);

    //  success 204
    EXPECT_EQ(result, "204 No Content");
    
    // Check if remove was actually called
    EXPECT_TRUE(fakeHandler.wasRemoveCalled);
    EXPECT_EQ(fakeHandler.lastRemovedFile, filename);
    
    // Check if file is gone from list
    EXPECT_EQ(fakeHandler.filesInStorage.size(), 2);
}