#pragma once
#include <string>
#include <vector>

class IFileHandler {
public:
    virtual ~IFileHandler() = default;

    // הפונקציות האלו חובה להיות קונסטיות כי הן לא משנות את מצב האובייקט
    virtual std::string getBasePath() const = 0; 
    virtual std::string readFile(const std::string& fileName) const = 0; 
    virtual std::vector<std::string> listFiles() const = 0; 
    virtual std::vector<std::string> findFiles(const std::string& fileContent) const = 0;

    // saveFile אינה קונסטית (כי היא משנה את מצב הדיסק)
    virtual void saveFile(const std::string& fileName, const std::string& content) = 0; 
};
