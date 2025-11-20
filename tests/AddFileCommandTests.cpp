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

    string getBasePath() override { return ""; }
    string readFile(const string& fileName) override { return ""; }
    vector<string> listFiles()  override { return {}; }
   
    void saveFile(const string& fileName, const string& content) override {
        saveCalled = true;
        savedName = fileName;
        savedContent = content;
    }
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
    add.execute("notes hello world"); // add file with name and content

    ASSERT_TRUE(fh.saveCalled); // check save was called
    EXPECT_EQ(fh.savedName, "notes"); // check file name
    EXPECT_EQ(fh.savedContent, "hello world"); // check content
}

// Test adding file with spaces in content
TEST(AddFileTests, AllowSpacesContent) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    add.execute("empty     "); // spaces should be preserved

    ASSERT_TRUE(fh.saveCalled);
    EXPECT_EQ(fh.savedName, "empty");
    EXPECT_EQ(fh.savedContent, "    "); // content is spaces
}

// Test that empty file name rejected
TEST(AddFileTests, RejectEmptyFileName) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    add.execute("   "); // no name

    ASSERT_FALSE(fh.saveCalled); // should not save
}

// Test that compression is actually called
TEST(AddFileTests, CompressionIsCalled) {
    MockFileHandler fh;
    MockCompressor comp;
    comp.out = "COMPRESSED!"; // fake compressed output

    AddFileCommand add(&fh, &comp);
    add.execute("data abc");

    ASSERT_TRUE(comp.compressCalled); // check compress called
    EXPECT_EQ(fh.savedContent, "COMPRESSED!"); // content is compressed
}