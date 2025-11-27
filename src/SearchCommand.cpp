#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

using namespace std;
// The contructor foe search command
SearchCommand::SearchCommand(IFileHandler *fh, ICompressor *comp, ostream &out)
    : fileHandler(fh), compressor(comp), output(out) {}

string SearchCommand::execute(const string &args)
{
    // If no search term provided, do nothing
    if (args.empty())
        return "400 Bad Request\n";

    string result;    
    int count = 0; // counter to know if to end line or do nothing
    // Iterate over all files
    
    for (const string &fname : fileHandler->listFiles())
    {
        // 1. First check filename (not compressed)
        if (fname.find(args) != string::npos)
        {
            result += fname + " ";
            count++;
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
        return "404 Not Found\n";

    return "200 Ok\n\n" + result + "\n";
}
