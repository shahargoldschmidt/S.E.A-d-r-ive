#include "gtest/gtest.h"
#include "OSFileHandler.h"
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <filesystem>
using namespace std;
namespace fs = std::filesystem;

// Helpe function read full content of a file
static string readFilePhysical(const fs::path& fullPath) {
    ifstream file(fullPath);
    if (!file.is_open()) return ""; // return empty if file can't open
    return string((istreambuf_iterator<char>(file)),
                  istreambuf_iterator<char>());
}

// runs before each test
class OSFileHandlerTest : public ::testing::Test {
protected:
    OSFileHandler handler;  // object under test
    const string ENV_NAME = "MY_FILE_PATH"; // env var name
    const fs::path basePath = "/tmp/test_project_data"; // test folder

    void SetUp() override {
        // Delete old folder if exists, then create new
        if (fs::exists(basePath))
            fs::remove_all(basePath);
        fs::create_directories(basePath);

        // Reset environment variable
        unsetenv(ENV_NAME.c_str());
    }
};

// getBasePath tests
TEST_F(OSFileHandlerTest, GetBasePath_ReturnsEmpty_WhenNotSet) {
    EXPECT_EQ(handler.getBasePath(), ""); // should be empty if env not set
}

TEST_F(OSFileHandlerTest, GetBasePath_ReturnsCorrectPath_WhenSet) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);
    EXPECT_EQ(handler.getBasePath(), basePath.string()); // should return set path
}

// saveFile tests
TEST_F(OSFileHandlerTest, SaveFile_CreatesFileWithCorrectContent) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "data_test.dat";
    string content  = "Content to verify save operation";
    fs::path fullPath = basePath / filename;

    handler.saveFile(filename, content); // save file

    EXPECT_EQ(readFilePhysical(fullPath), content); // content should match
}

TEST_F(OSFileHandlerTest, SaveFile_UsesCorrectFullPath) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "check_path.dat";
    fs::path fullPath = basePath / filename;

    handler.saveFile(filename, "test"); // save file

    EXPECT_TRUE(fs::exists(fullPath)); // file should exist
}

// readFile tests
TEST_F(OSFileHandlerTest, ReadFile_ReturnsCorrectContent) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "read_test.bin";
    string content = "Content to verify.";
    fs::path fullPath = basePath / filename;

    ofstream(fullPath) << content; // create file with content

    EXPECT_EQ(handler.readFile(filename), content); // should read content
}

TEST_F(OSFileHandlerTest, ReadFile_ReturnsEmpty_WhenFileMissing) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    EXPECT_EQ(handler.readFile("no_such_file.dat"), ""); // missing file -> empty
}

TEST_F(OSFileHandlerTest, ReadFile_ReturnsEmpty_ForEmptyFile) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    fs::path fullPath = basePath / "empty.dat";
    ofstream(fullPath).close(); // create empty file

    EXPECT_EQ(handler.readFile("empty.dat"), ""); // should return empty
}

// listFiles tests
TEST_F(OSFileHandlerTest, ListFiles_ReturnsEmpty_WhenDirectoryEmpty) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    EXPECT_TRUE(handler.listFiles().empty()); // empty dir -> empty list
}

TEST_F(OSFileHandlerTest, ListFiles_ReturnsCorrectFileNames) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    fs::path a = basePath / "fileA.dat";
    fs::path b = basePath / "fileB.dat";

    ofstream(a).close();
    ofstream(b).close(); // create 2 files

    auto files = handler.listFiles();

    EXPECT_EQ(files.size(), 2); // should return 2 files
    EXPECT_NE(find(files.begin(), files.end(), "fileA.dat"), files.end()); // fileA exists
    EXPECT_NE(find(files.begin(), files.end(), "fileB.dat"), files.end()); // fileB exists
}

// removeFile tests
TEST_F(OSFileHandlerTest, RemoveFile_RemovesExistingFile) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "delete_me.dat";
    fs::path fullPath = basePath / filename;

    // Create a file manually
    ofstream(fullPath) << "temporary content";
    ASSERT_TRUE(fs::exists(fullPath)); // Verify it was created

    // Call removeFile
    handler.removeFile(filename);

    // Check file is gone
    EXPECT_FALSE(fs::exists(fullPath)); 
}

TEST_F(OSFileHandlerTest, RemoveFile_DoesNotCrash_WhenFileMissing) {
    setenv(ENV_NAME.c_str(), basePath.string().c_str(), 1);

    string filename = "ghost_file.dat";
    fs::path fullPath = basePath / filename;

    // Verify file surely doesn't exist
    if(fs::exists(fullPath)) fs::remove(fullPath);

    // Try to remove non-existent file - return without error/crash
    handler.removeFile(filename); 

    // Assert
    EXPECT_FALSE(fs::exists(fullPath));
}ה