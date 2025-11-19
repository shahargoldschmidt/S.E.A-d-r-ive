
#include "gtest/gtest.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
using namespace std;

//sample compressor and sample FileHandle for the test 
class SampleCompressor : public ICompressor {
public:
    string compress(const string& s) override {
        return s;
    }
    string decompress(const string& s) override {
        return s;
    }
};


class SampleFileHandler : public IFileHandler {
public: 
    vector<string> files;
    map<string, string> content;
    string getBasePath() override { return ""; }
    void saveFile(const string& fname, const string& data) override { content[fname] = data; }
    string readFile(const string& fname) override { return content[fname]; }
    vector<string> listFiles() override { return files; }
};


 //test for finding multiple correct files
 TEST(SearchCommandTester, MultipleFilesFinder) {
    SampleCompressor SampComp;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");
    SearchCommand cmd(&fh, &SampComp, cout);
    testing::internal::CaptureStdout();
    cmd.execute("is for");
    string output = testing::internal::GetCapturedStdout();
    ASSERT_NE(output.find("f.txt"), string::npos);
    ASSERT_NE(output.find("u.txt"), string::npos);
    ASSERT_EQ(output.find("n.txt"), string::npos);
}

 //test for no matches
 TEST (SearchCommandTester, NoMatches){
    SampleCompressor SampComp;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");
    SearchCommand cmd(&fh, &SampComp, cout);
    testing::internal::CaptureStdout();
    cmd.execute("no such phrase");
    string output = testing::internal::GetCapturedStdout();
    ASSERT_TRUE(output.empty());
 }

 //test for empty searches
 TEST(SearchCommandTester, ArgsEmptyReturnsNothing) {
    SampleCompressor SampComp;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");
    SearchCommand cmd(&fh, &SampComp, cout);
    testing::internal::CaptureStdout();
    cmd.execute(""); // Empty args
    string output = testing::internal::GetCapturedStdout();
    ASSERT_TRUE(output.empty());
};
 