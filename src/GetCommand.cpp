#include "GetCommand.h"
#include <sstream>

using namespace std;

// Constructor for the get command
GetCommand::GetCommand(IFileHandler *fh, ICompressor *comp, std::ostream &output)
    : fileHandler(fh), compressor(comp), out(output) {}

void GetCommand::execute(const string &args)
{
    // If the user typed nothing, ignore the command silently
    if (args.empty() || isspace(args[0]))
    {
        return;
    }

    istringstream iss(args);
    string fileName;
    string rest;

    // Extract the first token, expected to be the filename
    iss >> fileName;

    // get what is after first token
    getline(iss, rest); 

    if (!rest.empty())
    {
        return;
    }
    // Read compressed content from file
    string compressedContent = fileHandler->readFile(fileName);

    // If file not found silently ignore 
    if (compressedContent.empty())
    {
        return;
    }

    // Decompress content using the strategy
    string decompressed = compressor->decompress(compressedContent);

    // Print decompressed content to the output stream
    out << decompressed << "\n";
}
