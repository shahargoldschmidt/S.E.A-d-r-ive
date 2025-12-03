#include "AddFileCommand.h"
#include <sstream>
#include <string>

using namespace std;

// The constructor for add command
AddFileCommand::AddFileCommand(IFileHandler* fh, ICompressor* comp)
    : fileHandler(fh), compressor(comp) {}

string AddFileCommand::execute(const string& input) {

    // if there is nothing after the command keep going without save file and warning
    if (input.empty() || isspace(input[0]))
        return "400 Bad Request";

    // separate the input
    stringstream ss(input);

    // The first word is the file name
    string fileName;
    ss >> fileName;

    // Reject empty file name
    if (fileName.empty())
        return "400 Bad Request";

    
    /*
    // If the file exist
    vector<string> files = fileHandler->listFiles();
    for (const string& currentFile : files) {
        if (currentFile == fileName) {
            // we dont change the file and send back it's a bar
            return "400 Bad Request"; 
        }
    } */

    string content;
    // Reads the rest of the line, including leading whitespace after the file name
    getline(ss, content);

    // Remove only the single leading space left by getline
    if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);

    // Do not trim trailing spaces, leave them as is so content like "    " is preserved
    string compressed = compressor->compress(content); //Commpres the content

    fileHandler->saveFile(fileName, compressed); // save the file
    return "201 Created";
}
