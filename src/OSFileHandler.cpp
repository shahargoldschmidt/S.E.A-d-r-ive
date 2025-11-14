#include "OSFileHandler.h"
#include <vector>
#include <string>


std::string OSFileHandler::getBasePath() {
    return "This is a wrong path"; 
}

void OSFileHandler::saveFile(const std::string& fileName, const std::string& content) {
    return;
}

std::string OSFileHandler::readFile(const std::string& fileName) {
    return "Wrong content"; 
}

std::vector<std::string> OSFileHandler::listFiles() {
    std::vector<std::string> wrongList = {"fake_file.txt"};
    return wrongList;
}

std::vector<std::string> OSFileHandler::findFiles(const std::string& fileContent) {
    return {};
}