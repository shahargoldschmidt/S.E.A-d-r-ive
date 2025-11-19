#include "gtest/gtest.h"
#include "OSFileHandler.h"
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <filesystem>
using namespace std;
namespace fs = std::filesystem;

//  Read file contant 

static string readFilePhysical(const fs::path& fullPath) {
    ifstream file(fullPath);
    if (!file.is_open()) return "";
    return string((istreambuf_iterator<char>(file)),
                       istreambuf_iterator<char>());
}

// Test Fixture - run befor each test
class OSFileHandlerTest : public ::testing::Test {
protected:
    OSFileHandler handler;
    const string ENV_NAME = "MY_FILE_PATH";
    const fs::path basePath = "/tmp/test_project_data";

    void SetUp() override {
        // Delete and create new folder
        if (fs::exists(basePath))
            fs::remove_all(basePath);
        fs::create_directories(basePath);

        // Reset envaiermant name
        unsetenv(ENV_NAME.c_str());
    }
};

// getBasePath

TEST_F(OSFileHandlerTest, GetBasePath_ReturnsEmpty_WhenNotSet) {
    EXPECT_EQ(handler.getBasePath(), "");
}

TEST_F(OSFileHandlerTest, GetBasePath_ReturnsCorrectPath_WhenSet) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);
    EXPECT_EQ(handler.getBasePath(), basePath.string());
}


// saveFile

TEST_F(OSFileHandlerTest, SaveFile_CreatesFileWithCorrectContent) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "data_test.dat";
    string content  = "Content to verify save operation";
    fs::path fullPath = basePath / filename;

    handler.saveFile(filename, content);

    EXPECT_EQ(readFilePhysical(fullPath), content);
}

TEST_F(OSFileHandlerTest, SaveFile_UsesCorrectFullPath) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "check_path.dat";
    fs::path fullPath = basePath / filename;

    handler.saveFile(filename, "test");

    EXPECT_TRUE(fs::exists(fullPath));
}

// readFile

TEST_F(OSFileHandlerTest, ReadFile_ReturnsCorrectContent) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "read_test.bin";
    string content = "Content to verify.";
    fs::path fullPath = basePath / filename;

    ofstream(fullPath) << content;

    EXPECT_EQ(handler.readFile(filename), content);
}

TEST_F(OSFileHandlerTest, ReadFile_ReturnsEmpty_WhenFileMissing) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    EXPECT_EQ(handler.readFile("no_such_file.dat"), "");
}

TEST_F(OSFileHandlerTest, ReadFile_ReturnsEmpty_ForEmptyFile) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    fs::path fullPath = basePath / "empty.dat";
    ofstream(fullPath).close();

    EXPECT_EQ(handler.readFile("empty.dat"), "");
}

// listFiles

TEST_F(OSFileHandlerTest, ListFiles_ReturnsEmpty_WhenDirectoryEmpty) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    EXPECT_TRUE(handler.listFiles().empty());
}

TEST_F(OSFileHandlerTest, ListFiles_ReturnsCorrectFileNames) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    fs::path a = basePath / "fileA.dat";
    fs::path b = basePath / "fileB.dat";

    ofstream(a).close();
    ofstream(b).close();

    auto files = handler.listFiles();

    EXPECT_EQ(files.size(), 2);
    EXPECT_NE(find(files.begin(), files.end(), "fileA.dat"), files.end());
    EXPECT_NE(find(files.begin(), files.end(), "fileB.dat"), files.end());
}
