#include "RLEStrategy.h"
#include <sstream>

using std::string;
using std::ostringstream;

string RLEStrategy::compress(const string& input) {
     // Empty input returns empty output
    if (input.empty()) return "";

    string result = "";
    int count = 1;

     // Go over the string and count repeated chars
    for (size_t i = 1; i <= input.size(); ++i) {
        // If we reached a different char OR the end of the string:
        if (i == input.size() || input[i] != input[i - 1]) {

            // Add the character + its count
            result += input[i - 1];
            result += std:: to_string(count);

            //reset the counter
            count = 1;

        } else {
            //same char
            count++;
        }
    }

    return result;
}



string RLEStrategy::decompress(const string& input) {
    string result = "";

    for (size_t i = 0; i < input.size(); ) {

        // First read the character and move to the number
        char ch = input[i++];
        int count = 0;

       // counting the number of the char
        while (i < input.size() && isdigit(input[i])) {
            // Convert char-digit to number
            count = count * 10 + (input[i] - '0');
            i++;
        }

        // Repeat character count times
          result += string(count, ch);
    }

    return result;
}
