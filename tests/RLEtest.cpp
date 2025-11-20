#include "gtest/gtest.h"
#include "RLEStrategy.h"

using namespace std;

// Helper to build expected binary string easily
string bin(uint8_t count, char c)
{
    return string(1, static_cast<char>(count)) + c;
}

// basic compression test
TEST(RLETests, CompressBasic)
{
    RLEStrategy rle;
    string input = "aaabbc";

    string expected =
        bin(3, 'a') +
        bin(2, 'b') +
        bin(1, 'c');

    EXPECT_EQ(rle.compress(input), expected);
}

// empty string test
TEST(RLETests, CompressEmptyString)
{
    RLEStrategy rle;
    EXPECT_EQ(rle.compress(""), "");
}

// single char test
TEST(RLETests, CompressSingleChar)
{
    RLEStrategy rle;
    string expected = bin(1, 'a');

    EXPECT_EQ(rle.compress("a"), expected);
}

// decompress basic 
TEST(RLETests, DecompressBasic)
{
    RLEStrategy rle;

    string compressed =
        bin(3, 'a') +
        bin(2, 'b') +
        bin(1, 'c');

    EXPECT_EQ(rle.decompress(compressed), "aaabbc");
}

// decompress long run
TEST(RLETests, DecompressLongRun)
{
    RLEStrategy rle;

    string compressed = bin(255, 'a');
    string expected(255, 'a');

    EXPECT_EQ(rle.decompress(compressed), expected);
}

// round trip
TEST(RLETests, RoundTrip)
{
    RLEStrategy rle;
    string input = "bbbbccccccccaaa11####xx";

    string compressed = rle.compress(input);
    EXPECT_EQ(rle.decompress(compressed), input);
}

// decompress empty
TEST(RLETests, DecompressEmptyString)
{
    RLEStrategy rle;
    EXPECT_EQ(rle.decompress(""), "");
}

// different characters test
TEST(RLETests, MixedCharacters)
{
    RLEStrategy rle;
    string input = "aa11bb##cc";

    string compressed = rle.compress(input);
    EXPECT_EQ(rle.decompress(compressed), input);
}

// complex mixed input compression
TEST(RLETests, CompressComplexMixedInput)
{
    RLEStrategy rle;

    // Input contains letters, digits, symbols, spaces, and repeated chars
    string input = "AA!!###  1233\n\t$$%%%%word";

    // Manually build expected compressed binary form
    string expected =
        bin(2, 'A') +  // "AA"
        bin(2, '!') +  // "!!"
        bin(3, '#') +  // "###"
        bin(2, ' ') +  // "  "
        bin(1, '1') +  // "1"
        bin(1, '2') +  // "2"
        bin(2, '3') +  // "33"
        bin(1, '\n') + // newline
        bin(1, '\t') + // tab
        bin(2, '$') +  // "$$"
        bin(4, '%') +  // "%%%%"
        bin(1, 'w') +
        bin(1, 'o') +
        bin(1, 'r') +
        bin(1, 'd');

    EXPECT_EQ(rle.compress(input), expected);
}
