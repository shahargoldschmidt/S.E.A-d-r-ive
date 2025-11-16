#include "ICommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <vector>
#include <string>
#include <iostream>

    #include "SearchCommand.h"
#include <string>
#include <iostream>

SearchCommand::SearchCommand(IFileHandler* fh, ICompressor* comp, std::ostream& out)
    : fileHandler(fh), compressor(comp), output(out) {}

void SearchCommand::execute(const std::string& args) {
    if (args.empty()) return;
    std::string compContent = compressor->compress(args);
    for (const std::string& fname : fileHandler->listFiles()) {
        std::string line = fileHandler->readFile(fname);
        if (line.find(compContent) != std::string::npos) {
            output << fname << " ";
        }
    }
    output << std::endl;
}
