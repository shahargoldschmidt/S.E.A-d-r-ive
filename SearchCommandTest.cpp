
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
    // No compression: just return the input as-is
    std::string compress(const std::string& s) override {
        return s;
    }
    // No decompression: just return the input as-is
    std::string decompress(const std::string& s) override {
        return s;
    }
};

class SampleFileHandler : public IFileHandler{
    std::vector<std::string> files; // File names
    std::map<std::string, std::string> content; // file line
    std::vector<std::string> listFiles() override {
        return files;
    }
    std::vector<std::string> readFile(const std::string& fname) override {
        return { content[fname] };
    }
}

 //test for finding multiple correct files
 TEST(SearchCommandTester, MultipleFilesFinder) {
    SampleRLECompressor rle;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = rle.compress("f is for friends");
    fh.content["u.txt"] = rle.compress("u is for u and me");
    fh.content["n.txt"] = rle.compress("not found");
    SearchCommand cmd(&fh, &rle, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute({"is for"});
    std::string output = testing::internal::GetCapturedStdout();
    ASSERT_NE(output.find("f.txt"), std::string::npos);
    ASSERT_NE(output.find("u.txt"), std::string::npos);
    ASSERT_EQ(output.find("n.txt"), std::string::npos);
}

 //test for no matches
 TEST (SearchCommandTester, NoMatches){
    SampleRLECompressor rle;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = rle.compress("f is for friends");
    fh.content["u.txt"] = rle.compress("u is for u and me");
    fh.content["n.txt"] = rle.compress("not found");
    SearchCommand cmd(&fh, &rle, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute({"no such phrase"});
    std::string output = testing::internal::GetCapturedStdout();
    ASSERT_TRUE(output.empty());
 }

 //test for empty searches
 TEST(SearchCommandTester, ArgsEmptyReturnsNothing) {
    SampleRLECompressor rle;
    SampleFileHandler fh;
    fh.files = {"f.txt", "u.txt", "n.txt"};
    fh.content["f.txt"] = rle.compress("f is for friends");
    fh.content["u.txt"] = rle.compress("u is for u and me");
    fh.content["n.txt"] = rle.compress("not found");
    SearchCommand cmd(&fh, &rle, std::cout);
    testing::internal::CaptureStdout();
    cmd.execute({}); // Empty args vector
    std::string output = testing::internal::GetCapturedStdout();
    ASSERT_TRUE(output.empty())
}
 