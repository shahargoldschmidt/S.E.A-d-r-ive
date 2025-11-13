#include "gtest/gtest.h"
#include "RLEStrategy.h"

// ---------- TEST 1: basic compression ----------
TEST(RLETests, CompressBasic) {
    RLEStrategy rle;
    std::string input = "aaabbc";
    std::string expected = "a3b2c1";

    EXPECT_EQ(rle.compress(input), expected);
}

// ---------- TEST 2: empty string ----------
TEST(RLETests, CompressEmptyString) {
    RLEStrategy rle;
    std::string input = "";
    std::string expected = "";

    EXPECT_EQ(rle.compress(input), expected);
}

// ---------- TEST 3: single char ----------
TEST(RLETests, CompressSingleChar) {
    RLEStrategy rle;
    EXPECT_EQ(rle.compress("a"), "a1");
}

// ---------- TEST 4: decompress basic ----------
TEST(RLETests, DecompressBasic) {
    RLEStrategy rle;
    std::string input = "a3b2c1";
    std::string expected = "aaabbc";

    EXPECT_EQ(rle.decompress(input), expected);
}

// ---------- TEST 5: decompress multi-digit numbers ----------
TEST(RLETests, DecompressMultiDigit) {
    RLEStrategy rle;
    std::string input = "a12";
    std::string expected = "aaaaaaaaaaaa";

    EXPECT_EQ(rle.decompress(input), expected);
}

// ---------- TEST 6: compress → decompress cycle ----------
TEST(RLETests, RoundTrip) {
    RLEStrategy rle;
    std::string input = "bbbbccccccccaaa";
    std::string compressed = rle.compress(input);

    EXPECT_EQ(rle.decompress(compressed), input);
}

// ---------- TEST 7: decompress empty ----------
TEST(RLETests, DecompressEmptyString) {
    RLEStrategy rle;
    EXPECT_EQ(rle.decompress(""), "");
}
