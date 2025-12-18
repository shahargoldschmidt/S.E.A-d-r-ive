#include "UpdateFileCommand.h"
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

UpdateFileCommand::UpdateFileCommand(IFileHandler* fh, ICompressor* comp)
    : fileHandler(fh), compressor(comp) {}

string UpdateFileCommand::execute(const string& args) {
    if (args.empty() || isspace(args[0])) {
        return "400 Bad Request";
    }

    stringstream ss(args);
    string fileName;
    ss >> fileName;

    // Check if filename is valid
    if (fileName.empty()) {
        return "400 Bad Request";
    }

    // Check server health
    string basePath = fileHandler->getBasePath();
    if (basePath.empty()) {
        return "500 Internal Server Error";
    }

    // Verify existence The file MUST exist to be updated
    vector<string> files = fileHandler->listFiles();
    bool exists = false;
    for (const string& f : files) {
        if (f == fileName) {
            exists = true;
            break;
        }
    }

    if (!exists) {
        return "404 Not Found";
    }

    // Read new content
    string newContent;
    getline(ss, newContent);

    // Remove leading space if exists
    if (!newContent.empty() && newContent[0] == ' ') {
        newContent.erase(0, 1);
    }

    // Compress and Overwrite
    string compressed = compressor->compress(newContent);
    fileHandler->overwriteFile(fileName, compressed);

    return "204 No Content";
}