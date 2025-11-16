#include "OSFileHandler.h"
#include <cstdlib>      
#include <fstream>
#include <string>
#include <vector> // Required for std::vector
#include <filesystem>

namespace fs = std::filesystem;

// Helper function to construct the full path of a file given a base path
fs::path get_full_path(const std::string& fileName, const std::string& basePath) {
    if (basePath.empty()) { 
        return {}; // Return empty path if basePath is not set
    }
    return fs::path(basePath) / fileName; // Concatenate basePath and fileName
}

// Retrieve base path from environment variable "MY_FILE_PATH"
std::string OSFileHandler::getBasePath() {
   
    const char* path = std::getenv("MY_FILE_PATH"); // Get environment variable
    
    if (path == nullptr) {
        return ""; 
    }
    
    return std::string(path); // Convert C-string to std::string
}


// Save content to a file in the base path
void OSFileHandler::saveFile(const std::string& fileName, const std::string& content) {
    std::string basePath = getBasePath();
    
    fs::path fullPath = get_full_path(fileName, basePath);
    if (fullPath.empty()) {
        return; // Do nothing if full path is invalid
    }
    
    std::ofstream file(fullPath, std::ios::binary);  // Open file in binary mode
    
    if (file.is_open()) {
        file << content; // Write content to file
        file.close(); // Close file 
    }
}

// Read content from a file in the base path
std::string OSFileHandler::readFile(const std::string& fileName) {
    std::string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);
    
    if (fullPath.empty() || !fs::exists(fullPath)) {
        return ""; // Return empty string if file does not exist
    }
    
    std::ifstream file(fullPath, std::ios::binary); 
    if (!file.is_open()) {
        return ""; // Return empty string if unable to open file
    }
    
    return std::string((std::istreambuf_iterator<char>(file)),
                         std::istreambuf_iterator<char>()); // Read entire file into string
}

// List all regular files in the base path
std::vector<std::string> OSFileHandler::listFiles() {
    std::vector<std::string> fileNames;
    std::string basePath = getBasePath();
    
    
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
