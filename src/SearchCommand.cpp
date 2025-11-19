#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

using namespace std;

SearchCommand::SearchCommand(IFileHandler *fh, ICompressor *comp, ostream &out)
    : fileHandler(fh), compressor(comp), output(out) {}

void SearchCommand::execute(const string &args)
{
    // If no search term provided, do nothing
    if (args.empty())
        return;
    string compContent = compressor->compress(args);
    int count = 0; // counter to know if to end line or do nothing
    // Iterate over all files
    for (const string &fname : fileHandler->listFiles())
    {
       
        string compressed = fileHandler->readFile(fname);
        // decompress the file content to search the users content
        string decompressed = compressor->decompress(compressed);
        // If compContent is not found, it returns "not found" as string::npos
        if (decompressed.find(args) != string::npos)
        {
            output << fname << " ";
            count++;
        }
    }
    if (count > 0)
        output << endl;
    return;
}
