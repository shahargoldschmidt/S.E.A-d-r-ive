#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

using namespace std;
// The contructor for search command
SearchCommand::SearchCommand(IFileHandler *fh, ICompressor *comp)
    : fileHandler(fh), compressor(comp) {}

string SearchCommand::execute(const string &args)
{
    // If no search term provided, do nothing
    if (args.empty())
        return "400 Bad Request";

    string result;    
    int count = 0; // counter to know if to end line or do nothing
    // Iterate over all files
    
    for (const string &fname : fileHandler->listFiles())
    {
        // First check filename (not compressed)
        if (fname.find(args) != string::npos)
        {
            result += fname + " ";
            count++;
            continue;
        }
       
        string compressed = fileHandler->readFile(fname);
        // decompress the file content to search the users content
        string decompressed = compressor->decompress(compressed);
        // If compContent is not found, it returns "not found" as string::npos
        if (decompressed.find(args) != string::npos)
        {
            result += fname + " ";
            count++;
        }
    }
    if (count == 0)
        return "404 Not Found";

    return "200 Ok\n\n" + result;
}
