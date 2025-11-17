#include "gtest/gtest.h"
#include "../src/AddFileCommand.h"
#include "../src/IFileHandler.h"
#include "../src/ICompressor.h"

// =========================
//      MOCK FILE HANDLER
// =========================
class MockFileHandler : public IFileHandler {
public:
    bool saveCalled = false;
    std::string savedName = "";
    std::string savedContent = "";

    std::string getBasePath() const override { return ""; }
    std::string readFile(const std::string& fileName) const override { return ""; }
    std::vector<std::string> listFiles() const override { return {}; }
    std::vector<std::string> findFiles(const std::string& fileContent) const override { return {}; }

    void saveFile(const std::string& fileName, const std::string& content) override {
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
    std::string out = "";

    std::string compress(const std::string& input) override {
        compressCalled = true;
        return out.empty() ? input : out;
    }

    std::string decompress(const std::string& input) override {
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
