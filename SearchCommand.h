#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"      
#include "IFileHandler.h"  
#include "ICompressor.h"   
#include <vector>
#include <string>

class SearchCommand : public ICommand {
private:
    IFileHandler* fileHandler;
    ICompressor* compressor;
    std::ostream& output;

public:
    SearchCommand(IFileHandler* fileHandler, ICompressor* compressor, std::ostream& output);
    // this execute returns list of file names containg content in users ouput
    void execute(const std::string& args) override;
};

#endif 
