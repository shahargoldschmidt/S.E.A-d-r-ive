#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>

class SearchCommand : public ICommand {
    IFileHandler* fileHandler;      // Handles file I/O operations
    ICompressor* compressor;        // Provides compression and decompression (e.g. RLE)
public:
    SearchCommand(IFileHandler* fh, ICompressor* comp)
        : fileHandler(fh), compressor(comp) {}

    //  receives the uncompressed file content
    void execute(const std::vector<std::string>& args) override {
        // If no search term provided, do nothing
        if (args.empty()) return;
        // Compress the input
        std::string compContent = compressor->compress(args[0]);
        // Iterate over all managed files
        for (const std::string& fname : fileHandler->listFiles()) {
            std::vector<std::string> lines = fileHandler->readFile(fname);
            bool found = false;
            // Check each line 
            for (const std::string& line : lines) {
               // If compContent is not found, it returns "not found" as std::string::npos  .
                if (line.find(compContent) != std::string::npos) {
                    found = true;
                    break; // no need to look further in this file
                }
            }
            // If found, print the plain file name to output
            if (found) {
                std::cout << fname << std::endl;
            }
        }
    }
};
