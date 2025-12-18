#include "gtest/gtest.h"
#include "../src/UpdateFileCommand.h"
#include "../src/IFileHandler.h"
#include "../src/ICompressor.h"
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// MOCK FILE HANDLER
class MockUpdateFileHandler : public IFileHandler {
public:
    bool overwriteCalled = false;
    string savedName = "";
    string savedContent = "";
    
    string mockBasePath = "./"; 
    vector<string> storedFiles; 

    // return the mock base path
    string getBasePath() override { return mockBasePath; }
    
    void saveFile(const string& fileName, const string& content) override {}
    string readFile(const string& fileName) override { return ""; }
    void removeFile(const string& fileName) override {}
    
    // return a ampty file list to check if the file is there
    vector<string> listFiles() override { return storedFiles; }

    // save the datd to check 
    void overwriteFile(const string& fileName, const string& content) override {
        overwriteCalled = true;
        savedName = fileName;
        savedContent = content;
    }
};

// MOCK COMPRESSOR
class MockUpdateCompressor : public ICompressor {
public:
    bool compressCalled = false;
    string out = "";

    string compress(const string& input) override {
        compressCalled = true;
        return out.empty() ? input : out;
    }

    string decompress(const string& input) override {
        return input;
    }
};

// --- TESTS ---
// Good update for an exist file
TEST(UpdateFileTests, NormalUpdateFile) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;

    // add name file to the list
    fh.storedFiles.push_back("notes.txt");

    UpdateFileCommand updateCmd(&fh, &comp);
    // Execute the command
    string result = updateCmd.execute("notes.txt new_content");

    // Assertions
    ASSERT_TRUE(fh.overwriteCalled); // make sure we called the overwrite function
    EXPECT_EQ(fh.savedName, "notes.txt"); // correct name file
    EXPECT_EQ(fh.savedContent, "new_content"); // correct content 
    EXPECT_EQ(result, "204 No Content"); 
}

// Update content with spaces
TEST(UpdateFileTests, AllowSpacesInContent) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;

    fh.storedFiles.push_back("list.txt");

    UpdateFileCommand updateCmd(&fh, &comp);
    // delete only the first space
    string result = updateCmd.execute("list.txt    spaced   content");

    ASSERT_TRUE(fh.overwriteCalled);
    EXPECT_EQ(fh.savedName, "list.txt");
    // Make sure the file was saved with the rest of the spaces
    EXPECT_EQ(fh.savedContent, "   spaced   content"); 
    EXPECT_EQ(result, "204 No Content");
}

// Update a file that doesnt exist
TEST(UpdateFileTests, FailIfFileMissing) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;

    //storedFiles ampty
    UpdateFileCommand updateCmd(&fh, &comp);
    string result = updateCmd.execute("ghost.txt data");

    ASSERT_FALSE(fh.overwriteCalled); // No need to save
    EXPECT_EQ(result, "404 Not Found"); // the error
}

// ampty input
TEST(UpdateFileTests, RejectEmptyInput) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;

    UpdateFileCommand updateCmd(&fh, &comp);
    string result = updateCmd.execute("");

    ASSERT_FALSE(fh.overwriteCalled);
    EXPECT_EQ(result, "400 Bad Request");
}

// make sure the commpression works
TEST(UpdateFileTests, CompressionIsCalled) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;
    
    fh.storedFiles.push_back("data.bin");
    comp.out = "ZIPPED_DATA"; // fake commpression

    UpdateFileCommand updateCmd(&fh, &comp);
    string result = updateCmd.execute("data.bin raw_data");

    ASSERT_TRUE(comp.compressCalled); //  call commpression
    EXPECT_EQ(fh.savedContent, "ZIPPED_DATA"); // the content we saved is the commpresd one 
    EXPECT_EQ(result, "204 No Content");
}

// Server error
TEST(UpdateFileTests, Returns500_WhenBasePathError) {
    MockUpdateFileHandler fh;
    MockUpdateCompressor comp;
    
    fh.mockBasePath = ""; // not good path

    UpdateFileCommand updateCmd(&fh, &comp);
    string result = updateCmd.execute("file.txt data");

    EXPECT_EQ(result, "500 Internal Server Error");
    ASSERT_FALSE(fh.overwriteCalled);
}