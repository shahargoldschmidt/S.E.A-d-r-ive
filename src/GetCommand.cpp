#include "GetCommand.h"
#include <sstream>
#include <algorithm> 

using namespace std;

// Constructor for the get command
GetCommand::GetCommand(IFileHandler *fh, ICompressor *comp)
    : fileHandler(fh), compressor(comp) {}

string GetCommand::execute(const string &args)
{
    // If the user typed nothing, it is a bad request
    if (args.empty() || isspace(args[0]))
    {
        return "400 Bad Request";
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
        return "400 Bad Request";
    }

     // ⭐ SERVER ERROR CHECK 1 — base path missing / invalid
    string basePath = fileHandler->getBasePath();
    if (basePath.empty()) {
        return "500 Internal Server Error";
    }

     // Check if file exists using listFiles
    vector<string> files = fileHandler->listFiles();
    if (find(files.begin(), files.end(), fileName) == files.end())
    {
        return "404 Not Found";
    }
    
    // Read compressed content from file
    string compressedContent = fileHandler->readFile(fileName);
    
   

    // Decompress content using the strategy
    string decompressed = compressor->decompress(compressedContent);

    // Print decompressed content to the output stream
    return "200 Ok\n\n" + decompressed;
}
