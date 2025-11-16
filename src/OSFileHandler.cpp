#include "OSFileHandler.h"
#include <cstdlib>      
#include <fstream>
#include <string>
#include <vector> // Essential for using the std::getenv function
#include <filesystem>

namespace fs = std::filesystem;

fs::path get_full_path(const std::string& fileName, const std::string& basePath) {
    if (basePath.empty()) {
        return {}; 
    }
    return fs::path(basePath) / fileName;
}


std::string OSFileHandler::getBasePath() {
   
    const char* path = std::getenv("MY_FILE_PATH");
    
    if (path == nullptr) {
        return ""; 
    }
    
    return std::string(path);
}



void OSFileHandler::saveFile(const std::string& fileName, const std::string& content) {
    std::string basePath = getBasePath();
    
    fs::path fullPath = get_full_path(fileName, basePath);
    if (fullPath.empty()) {
        return; 
    }
    
    std::ofstream file(fullPath, std::ios::binary); 
    
    if (file.is_open()) {
        file << content; 
        file.close();
    }
}


std::string OSFileHandler::readFile(const std::string& fileName) {
    std::string basePath = getBasePath();
    fs::path fullPath = get_full_path(fileName, basePath);
    
    if (fullPath.empty() || !fs::exists(fullPath)) {
        return "";
    }
    
    std::ifstream file(fullPath, std::ios::binary); 
    if (!file.is_open()) {
        return "";
    }
    
    return std::string((std::istreambuf_iterator<char>(file)),
                         std::istreambuf_iterator<char>());
}


std::vector<std::string> OSFileHandler::listFiles() {
    std::vector<std::string> fileNames;
    std::string basePath = getBasePath();
    
    
    if (basePath.empty() || !fs::exists(basePath)) {
        return fileNames; 
    }
    
    
    for (const auto& entry : fs::directory_iterator(basePath)) {
        
        if (entry.is_regular_file()) {
            fileNames.push_back(entry.path().filename().string());
        }
    }
    
    return fileNames;
}