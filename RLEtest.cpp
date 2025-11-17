#include "gtest/gtest.h"
#include "RLEStrategy.h"

// Helper to build expected binary string easily
std::string bin(uint8_t count, char c)
{
    return std::string(1, static_cast<char>(count)) + c;
}

// ---------- TEST 1: basic compression ----------
TEST(RLETests, CompressBasic)
{
    RLEStrategy rle;
    std::string input = "aaabbc";

    std::string expected =
        bin(3, 'a') +
        bin(2, 'b') +
        bin(1, 'c');

    EXPECT_EQ(rle.compress(input), expected);
}

// ---------- TEST 2: empty string ----------
TEST(RLETests, CompressEmptyString)
{
    RLEStrategy rle;
    EXPECT_EQ(rle.compress(""), "");
}

// ---------- TEST 3: single char ----------
TEST(RLETests, CompressSingleChar)
{
    RLEStrategy rle;
    std::string expected = bin(1, 'a');

    EXPECT_EQ(rle.compress("a"), expected);
}

// ---------- TEST 4: decompress basic ----------
TEST(RLETests, DecompressBasic)
{
    RLEStrategy rle;

    std::string compressed =
        bin(3, 'a') +
        bin(2, 'b') +
        bin(1, 'c');

    EXPECT_EQ(rle.decompress(compressed), "aaabbc");
}

// ---------- TEST 5: decompress long run ----------
TEST(RLETests, DecompressLongRun)
{
    RLEStrategy rle;

    std::string compressed = bin(255, 'a');
    std::string expected(255, 'a');

    EXPECT_EQ(rle.decompress(compressed), expected);
}

// ---------- TEST 6: round trip ----------
TEST(RLETests, RoundTrip)
{
    RLEStrategy rle;
    std::string input = "bbbbccccccccaaa11####xx";

    std::string compressed = rle.compress(input);
    EXPECT_EQ(rle.decompress(compressed), input);
}

// ---------- TEST 7: decompress empty ----------
TEST(RLETests, DecompressEmptyString)
{
    RLEStrategy rle;
    EXPECT_EQ(rle.decompress(""), "");
}

// ---------- TEST 8: different characters ----------
TEST(RLETests, MixedCharacters)
{
    RLEStrategy rle;
    std::string input = "aa11bb##cc";

    std::string compressed = rle.compress(input);
    EXPECT_EQ(rle.decompress(compressed), input);
}

// ---------- TEST 9: complex mixed input compression ----------
TEST(RLETests, CompressComplexMixedInput)
{
    RLEStrategy rle;

    // Input contains letters, digits, symbols, spaces, and repeated chars
    std::string input = "AA!!###  1233\n\t$$%%%%word";

    // Manually build expected compressed binary form
    std::string expected =
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
