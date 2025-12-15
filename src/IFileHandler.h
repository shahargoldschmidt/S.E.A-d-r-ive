#ifndef IFILEHANDLER_H
#define IFILEHANDLER_H
#include <string>
#include <vector>

// Interface for basic file storage operations
class IFileHandler {
public:
    virtual ~IFileHandler() = default;

    // Returns the root directory by the handler
    virtual std::string getBasePath() = 0;

    // Saves content to a file under the base path
    virtual void saveFile(const std::string& fileName, const std::string& content) = 0;

    // Reads and returns the full contents of the specified file
    virtual std::string readFile(const std::string& fileName) = 0;

    // Lists all files available under the base path (Supports sub-folders)
    virtual std::vector<std::string> listFiles(const std::string& subPath = "") = 0;
    
    // Removes the specified file or directory (Recursive)
    virtual void removeFile(const std::string& fileName) = 0;
    
    // Overwrites content of an existing file (Creates if not exists)
    virtual void overwriteFile(const std::string& fileName, const std::string& content) = 0;
    
    // Checks if a path is a directory
    virtual bool isDirectory(const std::string& path) = 0;

    // Creates a new directory
    virtual void createDirectory(const std::string& dirName) = 0;

    // Renames a file or directory
    virtual void renamePath(const std::string& oldName, const std::string& newName) = 0;
};

#endif