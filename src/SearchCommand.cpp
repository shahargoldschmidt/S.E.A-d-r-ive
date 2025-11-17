#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

SearchCommand::SearchCommand(IFileHandler *fh, ICompressor *comp, std::ostream &out)
    : fileHandler(fh), compressor(comp), output(out) {}

void SearchCommand::execute(const std::string &args)
{
    // If no search term provided, do nothing
    if (args.empty())
        return;
    std::string compContent = compressor->compress(args);
    int count = 0; // counter to know if to end line or do nothing
    // Iterate over all files
    for (const std::string &fname : fileHandler->listFiles())
    {
       // if (fname.find(args) != std::string::npos)
       // {
       //     output << fname << " ";
       //     count++;
        //    continue;
        //}

        std::string compressed = fileHandler->readFile(fname);
        // decompress the file content to search the users content
        std::string decompressed = compressor->decompress(compressed);
        // If compContent is not found, it returns "not found" as std::string::npos
        if (decompressed.find(args) != std::string::npos)
        {
            output << fname << " ";
            count++;
        }
    }
    if (count > 0)
        output << std::endl;
    return;
}
