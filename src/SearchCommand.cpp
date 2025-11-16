#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

class SearchCommand : public ICommand {
    IFileHandler* fileHandler;      
    ICompressor* compressor;  
    std::ostream& output;

    public:
        SearchCommand(IFileHandler* fh, ICompressor* comp, std::ostream& out)
            : fileHandler(fh), compressor(comp), output(out) {}

        //  receives the uncompressed file content
        void execute(const std::string& args) override {
         // If no search term provided, do nothing
            if (args.empty()) return;
            std::string compContent = compressor->compress(args); // Compress the input
            // Iterate over all files
            for (const std::string& fname : fileHandler->listFiles()) {
                std::string line = fileHandler->readFile(fname);
                bool found = false;
                // If compContent is not found, it returns "not found" as std::string::npos
                if (line.find(compContent) != std::string::npos) {
                    found = true;
                // If found, print the file name to output
                if (found) {
                    output << fname << " ";
                }
            }
        } output << std::endl;
    }
};