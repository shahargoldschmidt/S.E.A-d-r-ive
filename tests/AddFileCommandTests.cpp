#include "gtest/gtest.h"
#include "../src/AddFileCommand.h"
#include "../src/IFileHandler.h"
#include "../src/ICompressor.h"

using namespace std;
// =========================
//      MOCK FILE HANDLER
// =========================
class MockFileHandler : public IFileHandler {
public:
    bool saveCalled = false;
    string savedName = "";
    string savedContent = "";

    string getBasePath() override { return ""; }
    string readFile(const string& fileName) override { return ""; }
    vector<string> listFiles()  override { return {}; }
    vector<string> findFiles(const string& fileContent) override { return {}; }

    void saveFile(const string& fileName, const string& content) override {
        saveCalled = true;
        savedName = fileName;
        savedContent = content;
    }
};

// =========================
//      MOCK COMPRESSOR
// =========================
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

// =========================
//         TESTS
// =========================

TEST(AddFileTests, NormalAddFile) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    add.execute("notes hello world");

    ASSERT_TRUE(fh.saveCalled);
    EXPECT_EQ(fh.savedName, "notes");
    EXPECT_EQ(fh.savedContent, "hello world");
}

TEST(AddFileTests, AllowSpacesContent) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    add.execute("empty     "); 

    ASSERT_TRUE(fh.saveCalled);
    EXPECT_EQ(fh.savedName, "empty");
    EXPECT_EQ(fh.savedContent, "    "); 
}

TEST(AddFileTests, RejectEmptyFileName) {
    MockFileHandler fh;
    MockCompressor comp;

    AddFileCommand add(&fh, &comp);
    add.execute("   ");

    ASSERT_FALSE(fh.saveCalled);  
}

TEST(AddFileTests, CompressionIsCalled) {
    MockFileHandler fh;
    MockCompressor comp;
    comp.out = "COMPRESSED!";

    AddFileCommand add(&fh, &comp);
    add.execute("data abc");

    ASSERT_TRUE(comp.compressCalled);
    EXPECT_EQ(fh.savedContent, "COMPRESSED!");
}
