
#include "gtest/gtest.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
using namespace std;

// Sample compressor and file handler for testing
class SampleCompressor : public ICompressor {
public:
    // just return the string as is
    string compress(const string& s) override { return s; }
    string decompress(const string& s) override { return s; }
};

class SampleFileHandler : public IFileHandler {
public: 
    vector<string> files;  // list of file names
    map<string, string> content; // file name -> content
    
    // Added control for base path
    string mockBasePath = "./";

    //  Return controllable base path 
    string getBasePath() override { return mockBasePath; } 
    
    void saveFile(const string& fname, const string& data) override { content[fname] = data; } // save to map
    string readFile(const string& fname) override { return content[fname]; }  // read from map
    vector<string> listFiles() override { return files; }  // return file names
    void removeFile(const std::string& fileName) override {}
};

// Test find multiple files matching the query
TEST(SearchCommandTester, MultipleFilesFinder) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp);

    // execute now returns the string directly
    string output = cmd.execute("is for"); // search query

    // Check return format "200 Ok\n\nResult"
    ASSERT_NE(output.find("200 Ok"), string::npos);
    ASSERT_NE(output.find("f.txt"), string::npos); // f.txt should appear
    ASSERT_NE(output.find("u.txt"), string::npos); // u.txt should appear
    ASSERT_EQ(output.find("n.txt"), string::npos); // n.txt should not appear
}

// test if search finds a file when the query matches the FILENAME even if the content doesn't match
TEST(SearchCommandTester, MatchesFilenameOnly) {
    SampleCompressor comp;
    SampleFileHandler fh;

    // File name contains "secret", content does not.
    fh.files = {"my_secret_file.txt"};
    fh.content["my_secret_file.txt"] = comp.compress("just some random content");

    SearchCommand cmd(&fh, &comp);

    // Search for "secret"
    string result = cmd.execute("secret");

    EXPECT_NE(result.find("200 Ok"), string::npos);
    EXPECT_NE(result.find("my_secret_file.txt"), string::npos);
}

// Test no matches found
TEST(SearchCommandTester, NoMatches) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp);

    string output = cmd.execute("no such phrase"); // query with no matches

    // Should return 404 Not Found
    EXPECT_EQ(output, "404 Not Found"); 
}

// Test empty search arguments
TEST(SearchCommandTester, ArgsEmptyReturnsNothing) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp);

    string output = cmd.execute(""); // empty query

    // Bad Request for empty args
    EXPECT_EQ(output, "400 Bad Request");
};

// New Test for Server Error - Invalid Base Path
TEST(SearchCommandTester, Returns500_WhenBasePathInvalid) {
    SampleCompressor SampComp;
    SampleFileHandler fh;
    
    fh.mockBasePath = ""; // Invalid base path logic

    SearchCommand cmd(&fh, &SampComp);

    string output = cmd.execute("query"); 
    
    EXPECT_EQ(output, "500 Internal Server Error");
}
 