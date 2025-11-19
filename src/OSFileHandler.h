#ifndef OSFILEHANDLER_H
#define OSFILEHANDLER_H

#include "IFileHandler.h"
#include <string>
#include <vector>

// File handler that works with the local operating system's filesystem
class OSFileHandler : public IFileHandler {
public:
    // Returns the base directory used for file operations
    std::string getBasePath() override;

    // Writes the given content to a file in the base directory
    void saveFile(const std::string& fileName, const std::string& content) override;

    // Reads and returns the contents of the specified file
    std::string readFile(const std::string& fileName) override;

    // Lists all files found in the base directory
    std::vector<std::string> listFiles() override;

};

#endif