#include "RLEStrategy.h"
#include <sstream>

using std::string;
using std::ostringstream;

string RLEStrategy::compress(const string& input) {
    if (input.empty()) return "";

    ostringstream out;
    int count = 1;

    for (size_t i = 1; i <= input.size(); ++i) {
        if (i == input.size() || input[i] != input[i - 1]) {
            out << input[i - 1] << count;
            count = 1;
        } else {
            count++;
        }
    }

    return out.str();
}

string RLEStrategy::decompress(const string& input) {
    ostringstream out;

    for (size_t i = 0; i < input.size(); ) {
        char ch = input[i++];
        int count = 0;

        // לקרוא מספר שעשוי להיות יותר מ־1 ספרה
        while (i < input.size() && isdigit(input[i])) {
            count = count * 10 + (input[i] - '0');
            i++;
        }

        out << string(count, ch);
    }

    return out.str();
}
