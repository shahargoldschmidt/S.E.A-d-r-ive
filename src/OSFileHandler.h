#ifndef OSFILEHANDLER_H
#define OSFILEHANDLER_H

#include "IFileHandler.h"
#include <string>
#include <vector>

// File handler that works with the local operating system filesystem
class OSFileHandler : public IFileHandler {
public:
    // Return the base directory for file operations
    std::string getBasePath() override;

    // Write the given content to a file in the base directory
    void saveFile(const std::string& fileName, const std::string& content) override;

    // Returns the contents of the specified file
    std::string readFile(const std::string& fileName) override;

    // List all files in the directory
    std::vector<std::string> listFiles() override;

};

#endif