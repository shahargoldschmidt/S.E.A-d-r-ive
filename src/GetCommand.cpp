#include "GetCommand.h"
#include <sstream>

using namespace std;

// Constructor for the get command
GetCommand::GetCommand(IFileHandler* fh, ICompressor* comp, std::ostream& output)
    : fileHandler(fh), compressor(comp), out(output) {}
    
void GetCommand::execute(const string& args) {
    // If the user typed nothing → ignore the command silently
    if (args.empty()) {
        return;
    }

    istringstream iss(args);
    string fileName;
    string extra;

    // Extract the first token (expected to be the filename)
    iss >> fileName;

    // Check if more tokens exist → filename contains spaces → invalid
    iss >> extra;
    if (!extra.empty()) {
        // Invalid command format → silently ignore, do nothing
        return;
    }

    // Read compressed content from file
    string compressedContent = fileHandler->readFile(fileName);

    // If file not found → silently ignore (as required by assignment)
    if (compressedContent.empty()) {
        return;
    }

    // Decompress content using the strategy (RLE)
    string decompressed = compressor->decompress(compressedContent);

    // Print decompressed content to the output stream
    out << decompressed << "\n";
}
