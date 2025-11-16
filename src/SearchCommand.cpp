#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>
#include "SearchCommand.h"

SearchCommand::SearchCommand(IFileHandler* fh, ICompressor* comp, std::ostream& out)
    : fileHandler(fh), compressor(comp), output(out) {}

void SearchCommand::execute(const std::string& args) {
    // If no search term provided, do nothing
    if (args.empty()) return;
    std::string compContent = compressor->compress(args);
    int count = 0; //counter to knof if to end line or do nothing
    // Iterate over all files
    for (const std::string& fname : fileHandler->listFiles()) {
        std::string line = fileHandler->readFile(fname);
        // If compContent is not found, it returns "not found" as std::string::npos
        if (line.find(compContent) != std::string::npos) {
            output << fname << " ";
            count++;
        }
    }
    if (count > 0) output << std::endl;
    return;
}
