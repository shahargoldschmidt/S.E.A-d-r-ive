#include "gtest/gtest.h"
#include "../src/AddFileCommand.h"
#include "../src/IFileHandler.h"
#include "../src/ICompressor.h"
using namespace std;
// MOCK FILE HANDLER
class MockFileHandler : public IFileHandler {
public:
    bool saveCalled = false;
    string savedName = "";
    string savedContent = "";
    
    // Added variables to control mock behavior for new tests
    string mockBasePath = "./"; 
    vector<string> storedFiles; 

    // Return base path (defaults to "./")
    string getBasePath() override { return mockBasePath; }
    
    string readFile(const string& fileName) override { return ""; }
    
    // Return actual stored files list
    vector<string> listFiles() override { return storedFiles; }
   
    // Simulate saving to list
    void saveFile(const string& fileName, const string& content) override {
        saveCalled = true;
        savedName = fileName;
        savedContent = content;
        storedFiles.push_back(fileName);
    }
    void removeFile(const std::string& fileName) override {}
    void overwriteFile(const string& fileName, const string& content) override {}
};


// MOCK COMPRESSOR
class MockCompressor : public ICompressor {
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

// Test adding a normal file
TEST(AddFileTests, NormalAddFile) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    string result = add.execute("notes hello world"); // add file with name and content

    ASSERT_TRUE(fh.saveCalled); // check save was called
    EXPECT_EQ(fh.savedName, "notes"); // check file name
    EXPECT_EQ(fh.savedContent, "hello world"); // check content
    EXPECT_EQ(result, "201 Created"); // Check return string
}

// Test adding file with spaces in content
TEST(AddFileTests, AllowSpacesContent) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    string result = add.execute("empty     "); // spaces should be preserved

    ASSERT_TRUE(fh.saveCalled);
    EXPECT_EQ(fh.savedName, "empty");
    EXPECT_EQ(fh.savedContent, "    "); // content is spaces
    EXPECT_EQ(result, "201 Created");
}

// Test that empty file name rejected
TEST(AddFileTests, RejectEmptyFileName) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    string result = add.execute("   "); // no name

    ASSERT_FALSE(fh.saveCalled); // should not save
    EXPECT_EQ(result, "400 Bad Request");
}

// Test that compression is actually called
TEST(AddFileTests, CompressionIsCalled) {
    MockFileHandler fh;
    MockCompressor comp;
    comp.out = "COMPRESSED!"; // fake compressed output

    AddFileCommand add(&fh, &comp);
    string result = add.execute("data abc");

    ASSERT_TRUE(comp.compressCalled); // check compress called
    EXPECT_EQ(fh.savedContent, "COMPRESSED!"); // content is compressed
    EXPECT_EQ(result, "201 Created");
}

//  Invalid Base Path
TEST(AddFileTests, Returns500_WhenBasePathError) {
    MockFileHandler fh;
    MockCompressor comp;
    
    // Simulate invalid base path
    fh.mockBasePath = ""; 

    AddFileCommand add(&fh, &comp);
    string result = add.execute("file data");

    EXPECT_EQ(result, "500 Internal Server Error");
    ASSERT_FALSE(fh.saveCalled); // Should verify we didn't try to save
}

// Save Verification Failed
TEST(AddFileTests, Returns500_WhenSaveVerificationFails) {
    MockFileHandler fh;
    MockCompressor comp;
    // Smulating OS failure, a local mock to override logic just for this test
    class BrokenSaveHandler : public MockFileHandler {
    public:
        void saveFile(const string& fileName, const string& content) override {
            // We pretend to save, but DON'T add to storedFiles vector
            saveCalled = true; 
        }
    };

    BrokenSaveHandler brokenFh;
    AddFileCommand add(&brokenFh, &comp);
    
    string result = add.execute("file data");

    ASSERT_TRUE(brokenFh.saveCalled); // We tried to save
    EXPECT_EQ(result, "500 Internal Server Error"); // But failed verification
}