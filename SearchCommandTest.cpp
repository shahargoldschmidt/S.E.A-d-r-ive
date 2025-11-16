
#include "gtest/gtest.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>

//sample compressor and sample FileHandle for the test 
class SampleCompressor : public ICompressor {
public:
    // add x to the beginning
    std::string compress(const std::string& s) override {
        return s;
    }

    // remove the first letter
    std::string decompress(const std::string& s) override {
        return s;
    }
};


class SampleFileHandler : public IFileHandler {
public: 
    std::vector<std::string> files;
    std::map<std::string, std::string> content;
    std::string getBasePath() override { return ""; }
    void saveFile(const std::string& fname, const std::string& data) override { content[fname] = data; }
    std::string readFile(const std::string& fname) override { return content[fname]; }
    std::vector<std::string> listFiles() override { return files; }
};


 //test for finding multiple correct files
 TEST(SearchCommandTester, MultipleFilesFinder) {
    SampleCompressor SampComp;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");
    SearchCommand cmd(&fh, &SampComp, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute("is for");
    std::string output = testing::internal::GetCapturedStdout();
    ASSERT_NE(output.find("f.txt"), std::string::npos);
    ASSERT_NE(output.find("u.txt"), std::string::npos);
    ASSERT_EQ(output.find("n.txt"), std::string::npos);
}

 //test for no matches
 TEST (SearchCommandTester, NoMatches){
    SampleCompressor SampComp;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = SampComp.compress("f is for friends");
    fh.content["u.txt"] = SampComp.compress("u is for u and me");
    fh.content["n.txt"] = SampComp.compress("not found");
    SearchCommand cmd(&fh, &SampComp, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute("no such phrase");
    std::string output = testing::internal::GetCapturedStdout();
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
    SearchCommand cmd(&fh, &SampComp, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute(""); // Empty args
    std::string output = testing::internal::GetCapturedStdout();
    ASSERT_TRUE(output.empty());
};
 