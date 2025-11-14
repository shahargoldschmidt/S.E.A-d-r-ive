#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"      
#include "IFileHandler.h"  
#include "ICompressor.h"   
#include <vector>
#include <string>

class SearchCommand : public ICommand {
public:
    SearchCommand(IFileHandler* fileHandler, ICompressor* compressor);
    // this execute returns list of file names containg content in users ouput
    void execute(const std::vector<std::string>& args) override;

private:
    IFileHandler* fileHandler;
    ICompressor* compressor;
};

#endif 
