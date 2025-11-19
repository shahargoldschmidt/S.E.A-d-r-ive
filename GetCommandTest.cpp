#include "gtest/gtest.h"
#include "GetCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <map>
#include <string>
#include <iostream>



// ------------------------------------------------------------
// Mock Compressor
// ------------------------------------------------------------
class SampleRLECompressor : public ICompressor
{
public:
    std::string compress(const std::string &s) override
    {
        if (s.empty())
            return "";
        std::string result;
        char curr = s[0];
        int count = 1;
        for (size_t i = 1; i < s.length(); ++i)
        {
            if (s[i] == curr)
            {
                ++count;
            }
            else
            {
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

    std::string decompress(const std::string &s) override
    {
        std::string res;
        for (size_t i = 0; i < s.length();)
        {
            char c = s[i++];
            std::string num;
            while (i < s.length() && isdigit(s[i]))
            {
                num += s[i++];
            }
            res.append(num.empty() ? 1 : std::stoi(num), c);
        }
        return res;
    }
};

// ------------------------------------------------------------
// Mock FileHandler
// ------------------------------------------------------------
class SampleFileHandler : public IFileHandler
{
public:
    std::map<std::string, std::string> files; // filename → content

    std::vector<std::string> listFiles() override
    {
        std::vector<std::string> v;
        for (auto &p : files)
            v.push_back(p.first);
        return v;
    }

    std::string readFile(const std::string &fname) override
    {
        if (files.find(fname) == files.end())
            return "";
        return files[fname];
    }

    bool saveFile(const std::string &, const std::string &) override { return true; }
    std::string getBasePath() override { return ""; }
    std::string findFile(const std::string &name) override
    {
        if (files.find(name) != files.end())
            return name;
        return "";
    }
};

// ------------------------------------------------------------
// TEST 1 — basic valid file retrieval
// ------------------------------------------------------------
TEST(GetCommandTester, ReturnsCorrectDecompressedContent)
{
    SampleRLECompressor rle;
    SampleFileHandler fh;

    fh.files["hello.txt"] = rle.compress("HELLOOO");

    GetCommand getCmd(&fh, &rle, std::cout);

    testing::internal::CaptureStdout();
    getCmd.execute({"hello.txt"});
    std::string output = testing::internal::GetCapturedStdout();

    ASSERT_EQ(output, "HELLOOO\n");
}

// ------------------------------------------------------------
// TEST 2 — file does not exist → no output, no crash
// ------------------------------------------------------------
TEST(GetCommandTester, MissingFileProducesNoOutput)
{
    SampleRLECompressor rle;
    SampleFileHandler fh;

    fh.files["a.txt"] = rle.compress("AAA");

    GetCommand cmd(&fh, &rle, std::cout);

    testing::internal::CaptureStdout();
    cmd.execute({"notexist.txt"});
    std::string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 3 — args empty → do nothing
// ------------------------------------------------------------
TEST(GetCommandTester, EmptyArgsReturnsNoOutput)
{
    SampleRLECompressor rle;
    SampleFileHandler fh;

    fh.files["x.txt"] = rle.compress("XXX");

    GetCommand cmd(&fh, &rle, std::cout);

    testing::internal::CaptureStdout();
    cmd.execute({""});
    std::string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 4 — filename contains spaces → invalid → no output
// ------------------------------------------------------------
TEST(GetCommandTester, FilenameWithSpacesIgnored)
{
    SampleRLECompressor rle;
    SampleFileHandler fh;

    fh.files["test.txt"] = rle.compress("TEST");

    GetCommand cmd(&fh, &rle, std::cout);

    testing::internal::CaptureStdout();
    cmd.execute({"test file"});
    std::string output = testing::internal::GetCapturedStdout();

    ASSERT_TRUE(output.empty());
}

// ------------------------------------------------------------
// TEST 5 — works with multiple different files
// ------------------------------------------------------------
TEST(GetCommandTester, MultipleFilesWorkIndependently)
{
    SampleRLECompressor rle;
    SampleFileHandler fh;

    fh.files["a.txt"] = rle.compress("AAAA");
    fh.files["b.txt"] = rle.compress("BBBBBB");

    GetCommand cmd(&fh, &rle, std::cout);

    testing::internal::CaptureStdout();
    cmd.execute({"b.txt"});
    std::string output = testing::internal::GetCapturedStdout();

    ASSERT_EQ(output, "BBBBBB\n");
}
