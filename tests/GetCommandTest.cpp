#include "gtest/gtest.h"
#include "GetCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <string>
#include <iostream>
#include <map>
#include <vector>
#include <sstream>
using namespace std;

// Sample compressor
class SCompressor : public ICompressor {
public:
    string compress(const string& s) override { return s; }
    string decompress(const string& s) override { return s; }
};

// Sample file handler
class SFileHandler : public IFileHandler {
public:
    map<string, string> content;
    string getBasePath() override { return ""; }
    void saveFile(const string& fname, const string& data) override { content[fname] = data; }
    string readFile(const string& fname) override {
        auto it = content.find(fname);
        if (it != content.end()) return it->second;
        return ""; // simulate "not found"
    }
    vector<string> listFiles() override {
        vector<string> res;
        for (const auto& p : content) res.push_back(p.first);
        return res;
    }
};

// TESTS
// test to see right output
TEST(GetCommandTester, ReturnsCorrectOutput) {
    SCompressor comp;
    SFileHandler fh;
    stringstream out;

    fh.content["hello.txt"] = comp.compress("HELLOOO");
    GetCommand cmd(&fh, &comp, out);

    cmd.execute("hello.txt");

    EXPECT_EQ(out.str(), "HELLOOO\n");
}

// tests for non existing files
TEST(GetCommandTester, MissingFileProducesNoOutput) {
    SCompressor comp;
    SFileHandler fh;
    stringstream out;
    GetCommand cmd(&fh, &comp, out);

    cmd.execute("not_exists.txt");

    EXPECT_TRUE(out.str().empty());
}

// test for no arguments
TEST(GetCommandTester, EmptyArgsDoNothing) {
    SCompressor comp;
    SFileHandler fh;
    stringstream out;
    fh.content["x.txt"] = comp.compress("XXX");
    GetCommand cmd(&fh, &comp, out);

    cmd.execute("");

    EXPECT_TRUE(out.str().empty());
}

// test with invalid file name
TEST(GetCommandTester, FilenameWithSpacesIgnored) {
    SCompressor comp;
    SFileHandler fh;
    stringstream out;
    fh.content["good.txt"] = comp.compress("DATA");
    GetCommand cmd(&fh, &comp, out);

    cmd.execute("bad name");

    EXPECT_TRUE(out.str().empty());
}

// test with multiple files 
TEST(GetCommandTester, MultipleFilesWorkIndependently) {
    SCompressor comp;
    SFileHandler fh;
    stringstream out;
    fh.content["a.txt"] = comp.compress("AAAA");
    fh.content["b.txt"] = comp.compress("BBBBBB");
    GetCommand cmd(&fh, &comp, out);

    cmd.execute("b.txt");

    EXPECT_EQ(out.str(), "BBBBBB\n"); 
}
