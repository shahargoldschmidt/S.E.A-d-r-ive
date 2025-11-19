#include "gtest/gtest.h"
#include "GetCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <map>
#include <string>
#include <iostream>

using namespace std;

// ------------------------------------------------------------
// Mock Compressor (RLE fake)
// ------------------------------------------------------------
class MockRLE : public ICompressor {
public:
    string compress(const string& s) override {
        // Fake but invertible: wrap s with brackets
        return "[" + s + "]";
    }

    string decompress(const string& s) override {
        if (s.size() >= 2 && s.front() == '[' && s.back() == ']')
            return s.substr(1, s.size() - 2);
        return s;
    }
};

// ------------------------------------------------------------
// Mock FileHandler (no filesystem!)
// ------------------------------------------------------------
class MockFileHandler : public IFileHandler {
public:
    map<string, string> files;

    string getBasePath() override { return ""; }

    void saveFile(const string& name, const string& content) override {
        files[name] = content;
    }

    string readFile(const string& name) override {
        if (files.count(name) == 0) return "";
        return files[name];
    }

    vector<string> listFiles() override {
        vector<string> v;
        for (auto& p : files) v.push_back(p.first);
        return v;
    }
};

// ------------------------------------------------------------
// TEST 1 — Valid file
// ------------------------------------------------------------
TEST(GetCommandTests, ReturnsCorrectOutput) {
    MockRLE comp;
    MockFileHandler fh;

    fh.files["hello.txt"] = comp.compress("HELLOOO");

    GetCommand cmd(&fh, &comp, cout);

    //catching the cout
    testing::internal::CaptureStdout();
    cmd.execute("hello.txt");
    // takes what execute printed out 
    string output = testing::internal::GetCapturedStdout();

    ASSERT_EQ(output, "HELLOOO\n");
}

// ------------------------------------------------------------
// TEST 2 — Missing file
// ------------------------------------------------------------
TEST(GetCommandTests, MissingFileProducesNoOutput) {
    MockRLE comp;
    MockFileHandler fh;

    GetCommand cmd(&fh, &comp, cout);

    //catching the cout
    testing::internal::CaptureStdout();
    cmd.execute("not_exists.txt");
     // takes what execute printed out 
    string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 3 — Empty argument
// ------------------------------------------------------------
TEST(GetCommandTests, EmptyArgsDoNothing) {
    MockRLE comp;
    MockFileHandler fh;

    fh.files["x.txt"] = comp.compress("XXX");

    GetCommand cmd(&fh, &comp, cout);

    //catching the cout
    testing::internal::CaptureStdout();
    cmd.execute("");
     // takes what execute printed out 
    string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 4 — Name with space → ignored
// ------------------------------------------------------------
TEST(GetCommandTests, FilenameWithSpacesIgnored) {
    MockRLE comp;
    MockFileHandler fh;

    fh.files["good.txt"] = comp.compress("DATA");

    GetCommand cmd(&fh, &comp, cout);

    //catching the cout
    testing::internal::CaptureStdout();
    cmd.execute("bad name");
     // takes what execute printed out 
    string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 5 — Many files, independent
// ------------------------------------------------------------
TEST(GetCommandTests, MultipleFilesWorkIndependently) {
    MockRLE comp;
    MockFileHandler fh;

    fh.files["a.txt"] = comp.compress("AAAA");
    fh.files["b.txt"] = comp.compress("BBBBBB");

    GetCommand cmd(&fh, &comp, cout);

    //catching the cout
    testing::internal::CaptureStdout();
    cmd.execute("b.txt");
     // takes what execute printed out 
    string output = testing::internal::GetCapturedStdout();

    ASSERT_EQ(output, "BBBBBB\n");
}
