#include "OSFileHandler.h"
#include <cstdlib>      
#include <fstream>
#include <string>
#include <vector> // Required for vector
#include <filesystem>

using namespace std;
namespace fs = std::filesystem;

// Helpe function to construct the full path of a file given a base path
fs::path get_full_path(const string& fileName, const string& basePath) {
    if (basePath.empty()) { 
        return {}; // Return empty path if basePath is not set
    }
    return fs::path(basePath) / fileName; // Connect basePath and fileName
}

// get base path from environment variable "MY_FILE_PATH"
string OSFileHandler::getBasePath() {
   
    const char* path = getenv("MY_FILE_PATH"); // Get environment variable
    
    if (path == nullptr) {
        return ""; 
    }
    
    return string(path); // Convert C string to string
}

// Save content to a file in the base path
void OSFileHandler::saveFile(const string& fileName, const string& content) {
    _mutex.lock(); // lock
    string basePath = getBasePath();
    
    fs::path fullPath = get_full_path(fileName, basePath);
    if (fullPath.empty()) {
        _mutex.unlock(); // must unlock before the return
        return; // Do nothing if full path is invalid
    }
    // If the file already exists
    if (fs::exists(fullPath)) {
        _mutex.unlock(); // must unlock before the return
        return; // Do nothing and exit
    }
    
    ofstream file(fullPath, ios::binary);  // Open file in binary mode    
    if (file.is_open()) {
        file << content; // Write content to file
        file.close(); // Close file 
    }

    _mutex.unlock(); // Unlock at the end of function
}

// Overwrite file content (Truncate) - NEW
void OSFileHandler::overwriteFile(const string& fileName, const string& content) {
    _mutex.lock();
    string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);

    if (fullPath.empty()) {
        _mutex.unlock();
        return;
    }

    // ios::trunc deletes old content
    ofstream file(fullPath, ios::binary | ios::trunc);    
    if (file.is_open()) {
        file << content;
        file.close();
    }
    _mutex.unlock();
}

// Read content from a file in the base path
string OSFileHandler::readFile(const string& fileName) {
    _mutex.lock(); // lock
    string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);

    if (fileName.empty()) {
        _mutex.unlock(); // must unlock before the return
        return ""; // Return empty string 
    }

    if (fullPath.empty() || !fs::exists(fullPath)) {
         _mutex.unlock(); // must unlock before the return
        return ""; // Return empty string if file does not exist
    }
        // Safety check: Don't read directory as file
    if (fs::is_directory(fullPath)) {
        _mutex.unlock();
        return "";
    }

    ifstream file(fullPath, ios::binary); 
    if (!file.is_open()) {
        _mutex.unlock(); // must unlock before the return
        return ""; // Return empty string if unable to open file
    }
    string content((istreambuf_iterator<char>(file)), istreambuf_iterator<char>()); // Read entire file into string
    
    _mutex.unlock(); // Unlock at the end of function
    return content;
 
}

// List all regular files in the base path
vector<string> OSFileHandler::listFiles(const string& subPath) {
    _mutex.lock(); // lock
    vector<string> fileNames;
    string basePath = getBasePath();
    
    // Construct full path with optional subPath
    fs::path fullPath = get_full_path(subPath, basePath);

    if (basePath.empty() || !fs::exists(basePath)) {
        _mutex.unlock(); // must unlock before the return
        return fileNames;  // Return empty vector if base path is invalid
    }
    
    // Ensure it's a directory
    if (!fs::is_directory(fullPath)) {
        _mutex.unlock();
        return fileNames;
    } 

    for (const auto& entry : fs::directory_iterator(fullPath)) {
         // Return both regular files and directories
        fileNames.push_back(entry.path().filename().string());
    }

    _mutex.unlock(); // Unlock at the end of function
    return fileNames;
}

// New function: Remove file
void OSFileHandler::removeFile(const string& fileName) {
    _mutex.lock(); // lock

    string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);

    if (fileName.empty() || fullPath.empty()) {
        _mutex.unlock(); // must unlock before return
        return;
    }

    // Checking if a file exists before delete
    if (fs::exists(fullPath)) {
        try {
            // Using remove_all to support folders
            fs::remove_all(fullPath);
        } catch (const fs::filesystem_error& e) {
    
        }
    }

    _mutex.unlock(); // Unlock at the end of function
}
// Create directory
void OSFileHandler::createDirectory(const string& dirName) {
    _mutex.lock();
    string basePath = getBasePath();
    fs::path fullPath = get_full_path(dirName, basePath);

    if (!dirName.empty() && !fs::exists(fullPath)) {
        try {
            fs::create_directory(fullPath);
        } catch (...) {}
    }
    _mutex.unlock();
}
// Check if path is directory
bool OSFileHandler::isDirectory(const string& path) {
    _mutex.lock();
    string basePath = getBasePath();
    fs::path fullPath = get_full_path(path, basePath);
    
    bool res = fs::exists(fullPath) && fs::is_directory(fullPath);
    _mutex.unlock();
    return res;
}

// Rename path
void OSFileHandler::renamePath(const string& oldName, const string& newName) {
    _mutex.lock();
    string basePath = getBasePath();
    fs::path oldPath = get_full_path(oldName, basePath);
    fs::path newPath = get_full_path(newName, basePath);

    if (fs::exists(oldPath)) {
        try {
            fs::rename(oldPath, newPath);
        } catch (...) {}
    }
    _mutex.unlock();
}