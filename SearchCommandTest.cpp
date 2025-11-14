/*
#include "gtest/gtest.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>

//sample compressor and sample FileHandle for the test 
class TestCompressor : public ICompressor {
public:
    std::string compress(const std::string& s) override {
        return "C:" + s; // Simple marker for tests
    }
    std::string decompress(const std::string& s) override {
        return "D:" + s; // Simple marker for tests
    }
};

/*class TestFileHandler : public IFileHandler{
    std::vector<std::string> files; // File names
    std::map<std::string, std::string> content; // file line
    std::vector<std::string> listFiles() override {
        return files;
    }
    std::vector<std::string> readFile(const std::string& fname) override {
        return { content[fname] };
    }
}
\\

 //test for finding multiple correct files
 TEST (SearchCommandTester, MultipleFilesFinder){
 TestCompressor TComp;
 TestFileHandler TFHandler;
 TFHandler.files = {"f.txt", "u.txt","n.txt"};
 TFHandler.content["f.txt"] = "C: f is for friends";
 TFHandler.content["u.txt"] = "C: u is for u and me";
 TFHandler.content["n.txt"] = "C: not found";
 SearchCommand cmd (&TFHandler, &TComp)
 testing::internal::CaptureStdout(); // captures anything printed to standard output
 cmd.execute({"is for"});
 std::string output = testing::internal::GetCapturedStdout(); //get the output as a string
 ASSERT_NE(output.find("D:f.txt"), std::string::npos);
 ASSERT_NE(output.find("D:u.txt"), std::string::npos);
 ASSERT_EQ(output.find("D:n.txt"), std::string::npos);
 }

 //test for no matches
 TEST (SearchCommandTester, NoMatches){
 TestCompressor TComp;
 TestFileHandler TFHandler;
 TFHandler.files = {"f.txt", "u.txt","n.txt"};
 TFHandler.content["f.txt"] = "C: f is for friends";
 TFHandler.content["u.txt"] = "C: u is for u and me";
 TFHandler.content["n.txt"] = "C: not found";
 SearchCommand cmd (&TFHandler, &TComp)
 testing::internal::CaptureStdout();
 cmd.execute({"matches"})
 auto output = testing::internal::GetCaptureStdout();
 ASSERT_TRUE(output.empty());
 }

 //test for empty searches
 TEST (SearchCommandTester, NoMatches){
 TestCompressor TComp;
 TestFileHandler TFHandler;
 TFHandler.files = {"f.txt", "u.txt","n.txt"};
 TFHandler.content["f.txt"] = "C: f is for friends";
 TFHandler.content["u.txt"] = "C: u is for u and me";
 TFHandler.content["n.txt"] = "C: not found";
 SearchCommand cmd(&fh, &comp); 
 testing::internal::CaptureStdout();
 cmd.execute( {}); // Empty args
 auto output = testing::internal::GetCapturedStdout();
 ASSERT_TRUE(output.empty());
}
 