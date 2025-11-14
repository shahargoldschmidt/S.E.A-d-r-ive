/*
#include "gtest/gtest.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>

//sample compressor and sample FileHandle for the test 
class TestRLECompressor : public ICompressor {
public:
    std::string compress(const std::string& s) override {
        if (s.empty()) return "";
        std::string result;
        char curr = s[0];
        int count = 1;
        for (size_t i = 1; i < s.length(); ++i) {
            if (s[i] == curr) {
                ++count;
            } else {
                result += curr;
                result += std::to_string(count);
                curr = s[i];
                count = 1;
            }
        }
        result += curr;
        result += std::to_string(count);
        return result;
    }
    std::string decompress(const std::string& s) override {
        std::string result;
        for (size_t i = 0; i < s.length(); ) {
            char c = s[i++];
            std::string num;
            while (i < s.length() && isdigit(s[i])) num += s[i++];
            result.append(num.empty() ? 1 : std::stoi(num), c);
        }
        return result;
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
 TFHandler.content["f.txt"] = rle.compress("f is for friends");
 TFHandler.content["u.txt"] = rle.compress("u is for u and me");
 TFHandler.content["n.txt"] = rle.compress("not found");
 SearchCommand cmd (&TFHandler, &TComp)
 testing::internal::CaptureStdout(); // captures anything printed to standard output
 cmd.execute({"is for"});
 std::string output = testing::internal::GetCapturedStdout(); //get the output as a string
 ASSERT_NE(output.find("f.txt"), std::string::npos);
 ASSERT_NE(output.find("u.txt"), std::string::npos);
 ASSERT_EQ(output.find("n.txt"), std::string::npos);
 }

 //test for no matches
 TEST (SearchCommandTester, NoMatches){
 TestCompressor TComp;
 TestFileHandler TFHandler;
 TFHandler.files = {"f.txt", "u.txt","n.txt"};
 TFHandler.content["f.txt"] = rle.compress("f is for friends");
 TFHandler.content["u.txt"] = rle.compress("u is for u and me");
 TFHandler.content["n.txt"] = rle.compress("not found");
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
 TFHandler.content["f.txt"] = rle.compress("f is for friends");
 TFHandler.content["u.txt"] = rle.compress("u is for u and me");
 TFHandler.content["n.txt"] = rle.compress("not found");
 SearchCommand cmd(&fh, &comp); 
 testing::internal::CaptureStdout();
 cmd.execute( {}); // Empty args
 auto output = testing::internal::GetCapturedStdout();
 ASSERT_TRUE(output.empty());
}
 