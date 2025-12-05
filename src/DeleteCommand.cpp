#include "DeleteCommand.h"
#include <vector>
#include <string>
#include <cctype>   // isspace
#include <sstream>  // stringstream
#include <algorithm>


using namespace std;

// Constructor
DeleteCommand::DeleteCommand(IFileHandler *fh)
    : fileHandler(fh) {}

string DeleteCommand::execute(const string &args)
{
    // If the string empty or starts with a space 
    if (args.empty() || isspace(args[0])) {
        return "400 Bad Request"; 
    }

    stringstream iss(args);
    string fileName;
    string rest;

    // The file name
    iss >> fileName;

    //  If there is anything after the file name it a bed request
    getline(iss, rest);

    if (!rest.empty()) {
        return "400 Bad Request";
    }

    
    // ⭐ SERVER ERROR CHECK 1 — base path invalid
    string basePath = fileHandler->getBasePath();
    if (basePath.empty()) {
        return "500 Internal Server Error";   
    }
    
    // Get the file list
    vector<string> files = fileHandler->listFiles();
    bool found = false;

    // search the file in the files list
    for (const string& currentFile : files) {
        if (currentFile == fileName) {
            found = true;
            break; 
        }
    }

    // If we found the file remove it
    if (found) {
        fileHandler->removeFile(fileName);

        // ⭐ SERVER ERROR CHECK 2 — remove failed
        vector<string> after = fileHandler->listFiles();
        if (find(after.begin(), after.end(), fileName) != after.end()) {
            return "500 Internal Server Error";   
        }
        return "204 No Content";
    } else {
        return "404 Not Found";
    }
}