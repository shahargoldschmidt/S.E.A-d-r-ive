
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
    vector<string> files; // list of file names
    map<string, string> content; // file name -> content

    string getBasePath() override { return ""; } // no base path
    void saveFile(const string& fname, const string& data) override { content[fname] = data; } // save to map
    string readFile(const string& fname) override { return content[fname]; }  // read from map
    vector<string> listFiles() override { return files; }  // return file names
};

// Test find multiple files matching the query
TEST(SearchCommandTester, MultipleFilesFinder) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp, cout);

    testing::internal::CaptureStdout();
    cmd.execute("is for"); // search query
    string output = testing::internal::GetCapturedStdout();

    ASSERT_NE(output.find("f.txt"), string::npos); // f.txt should appear
    ASSERT_NE(output.find("u.txt"), string::npos); // u.txt should appear
    ASSERT_EQ(output.find("n.txt"), string::npos); // n.txt should not appear
}

// Test no matches found
TEST(SearchCommandTester, NoMatches) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp, cout);

    testing::internal::CaptureStdout();
    cmd.execute("no such phrase"); // query with no matches
    string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty()); // nothing should be printed
}

// Test empty search arguments
TEST(SearchCommandTester, ArgsEmptyReturnsNothing) {
    SampleCompressor SampComp;
    SampleFileHandler fh;

    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");

    SearchCommand cmd(&fh, &SampComp, cout);

    testing::internal::CaptureStdout();
    cmd.execute(""); // empty query
    string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty()); // nothing should be printed
};

 