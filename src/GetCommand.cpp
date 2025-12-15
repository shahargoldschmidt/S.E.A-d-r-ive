#include "GetCommand.h"
#include <sstream>
#include <algorithm> 
#include <vector> // הוספתי: נדרש לשימוש ב-vector

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
    string path;
    string rest;

    // Extract the first token, expected to be the path/filename
    iss >> path;

    // get what is after first token
    getline(iss, rest);

    if (!rest.empty())
    {
        return "400 Bad Request";
    }

     // base path missing / invalid
    string basePath = fileHandler->getBasePath();
    if (basePath.empty()) {
        return "500 Internal Server Error";
    }

     // Check if file exists using listFiles
    vector<string> files = fileHandler->listFiles();
    if (find(files.begin(), files.end(), path) == files.end())
    {
        // The current folder is "."
        if (path != ".") { 
            return "404 Not Found";
        }
    }
    // Automatic Decision is it a File or Directory?
    
     // The user requested a directory
    if (fileHandler->isDirectory(path)) {
        vector<string> files = fileHandler->listFiles(path);
        
        string result = "";
        for (const string& f : files) {
            result += f + "\n";
        }
        return "200 Ok\n\n" + result;
    }

     // It's not a directory,  Read compressed content from file
    string compressedContent = fileHandler->readFile(path);
    

    // Decompress content using the strategy
    string decompressed = compressor->decompress(compressedContent);

    // Print decompressed content to the output stream
    return "200 Ok\n\n" + decompressed;
}
