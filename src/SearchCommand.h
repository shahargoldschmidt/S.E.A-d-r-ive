#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"      
#include "IFileHandler.h"  
#include "ICompressor.h"   
#include <vector>
#include <string>

// Command that searches stored files for matches
class SearchCommand : public ICommand {
private:
    IFileHandler* fileHandler;   // Access to stored files
    ICompressor* compressor; // Used to decompress file contents
    std::ostream& output;  // Output stream for search results

public:
    SearchCommand(IFileHandler* fileHandler, ICompressor* compressor, std::ostream& output);
    // Returns a list of file names that contain the user-provided text
    std::string execute(const std::string& args) override;
};

#endif 
