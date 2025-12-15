#ifndef OSFILEHANDLER_H
#define OSFILEHANDLER_H

#include "IFileHandler.h"
#include <string>
#include <vector>
#include <mutex>

// File handler that works with the local operating system filesystem
class OSFileHandler : public IFileHandler {
private:
    std::mutex _mutex; // Lock for thread safety
public:
    // Return the base directory for file operations
    std::string getBasePath() override;

    // write the given content to a file in the base directory
    void saveFile(const std::string& fileName, const std::string& content) override;

    // Returns the contents of the specified file
    std::string readFile(const std::string& fileName) override;

   // List all files in the directory (supports sub-path)
    std::vector<std::string> listFiles(const std::string& subPath = "") override;

    // Remove a specified file
    void removeFile(const std::string& fileName) override;

    // Overwrite existing file content (Truncate)
    void overwriteFile(const std::string& fileName, const std::string& content) override;

    // Check if path is a directory
    bool isDirectory(const std::string& path) override;

    // Create a new directory
    void createDirectory(const std::string& dirName) override;

    // Rename file or directory
    void renamePath(const std::string& oldName, const std::string& newName) override;
};

#endif
