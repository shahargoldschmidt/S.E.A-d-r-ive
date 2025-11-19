#include "RLEStrategy.h"
#include <cstdint> 

// ---------------------------------------------------------
// compress
// Takes a plain text string and returns a compressed string
// encoded in binary format using RLE (Run-Length Encoding).
//
// Format:
//   [count][char][count][char]...
//
// - 'count' is stored as a single byte (uint8_t), range 1–255.
// - 'char' is the original character that is repeated.
// ---------------------------------------------------------
std::string RLEStrategy::compress(const std::string& input) {
    std::string output;

    // Pre-allocate memory to reduce re-allocations during push_back
    output.reserve(input.size());

    size_t i = 0;

    while (i < input.size()) {
        //saving the char
        char currentChar = input[i];
        // number of consecutive occurrences
        uint8_t count = 1;  
        //cheking the next char 
        i++;

        // Count repeated characters up to 255 (limit of uint8_t)
        while (i < input.size() && input[i] == currentChar && count < 255) {
            count++;
            i++;
        }

        // Store count as a single byte
        output.push_back(static_cast<char>(count));

        // Store the character itself
        output.push_back(currentChar);
    }

    return output;
}



// ---------------------------------------------------------
// decompress
// The function expects pairs of bytes:
//   [count][char]
// The result is returned as a normal printable string.
// ---------------------------------------------------------
std::string RLEStrategy::decompress(const std::string& input) {
    std::string output;

    // Iterate in steps of 2 bytes: (count, char)
    for (size_t i = 0; i + 1 < input.size(); i += 2) {
        // Read the raw byte and saves it as a number.
        uint8_t count = static_cast<uint8_t>(input[i]);
        char character = input[i + 1];

        // Append the character 'count' times
        output.append(count, character);
    }

    return output;
}
