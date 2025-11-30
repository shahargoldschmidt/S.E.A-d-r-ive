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

    // Lists all files available under the base path
    virtual std::vector<std::string> listFiles() = 0;

};

#endif