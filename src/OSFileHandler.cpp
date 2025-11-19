#include "OSFileHandler.h"
#include <cstdlib>      
#include <fstream>
#include <string>
#include <vector> // Required for vector
#include <filesystem>
using namespace std;
namespace fs = std::filesystem;

// Helper function to construct the full path of a file given a base path
fs::path get_full_path(const string& fileName, const string& basePath) {
    if (basePath.empty()) { 
        return {}; // Return empty path if basePath is not set
    }
    return fs::path(basePath) / fileName; // Concatenate basePath and fileName
}

// Retrieve base path from environment variable "MY_FILE_PATH"
string OSFileHandler::getBasePath() {
   
    const char* path = getenv("MY_FILE_PATH"); // Get environment variable
    
    if (path == nullptr) {
        return ""; 
    }
    
    return string(path); // Convert C-string to string
}

// Save content to a file in the base path
void OSFileHandler::saveFile(const string& fileName, const string& content) {
    string basePath = getBasePath();
    
    fs::path fullPath = get_full_path(fileName, basePath);
    if (fullPath.empty()) {
        return; // Do nothing if full path is invalid
    }
    // If the file exists
    if (fs::exists(fullPath)) {
        return; // Do nothing and exit
    }
    
    ofstream file(fullPath, ios::binary);  // Open file in binary mode    
    if (file.is_open()) {
        file << content; // Write content to file
        file.close(); // Close file 
    }
}

// Read content from a file in the base path
string OSFileHandler::readFile(const string& fileName) {
    string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);

    if (fileName.empty()) {
        return ""; // Return empty string 
    }

    if (fullPath.empty() || !fs::exists(fullPath)) {
        return ""; // Return empty string if file does not exist
    }
    
    ifstream file(fullPath, ios::binary); 
    if (!file.is_open()) {
        return ""; // Return empty string if unable to open file
    }
    
    return string((istreambuf_iterator<char>(file)),
                         istreambuf_iterator<char>()); // Read entire file into string
}

// List all regular files in the base path
vector<string> OSFileHandler::listFiles() {
    vector<string> fileNames;
    string basePath = getBasePath();
    
    
    if (basePath.empty() || !fs::exists(basePath)) {
        return fileNames;  // Return empty vector if base path is invalid
    }
    
    
    for (const auto& entry : fs::directory_iterator(basePath)) {
        
        if (entry.is_regular_file()) {
            fileNames.push_back(entry.path().filename().string());  // Add filename only
        }
    }
    
    return fileNames;
}
