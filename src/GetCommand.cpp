#include "GetCommand.h"
#include <sstream>

using namespace std;

// Constructor for the get command
GetCommand::GetCommand(IFileHandler *fh, ICompressor *comp)
    : fileHandler(fh), compressor(comp) {}

string GetCommand::execute(const string &args)
{
    // If the user typed nothing, ignore the command silently
    if (args.empty() || isspace(args[0]))
    {
        return "400 Bad Request\n";
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
        return "400 Bad Request\n";
    }
    // Read compressed content from file
    string compressedContent = fileHandler->readFile(fileName);

    // If file not found silently ignore 
    if (compressedContent.empty())
    {
        return "404 Not Found\n";
    }

    // Decompress content using the strategy
    string decompressed = compressor->decompress(compressedContent);

    // Print decompressed content to the output stream
    return "200 Ok\n\n" + decompressed + "\n";
}
