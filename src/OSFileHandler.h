#include "IFileHandler.h"
#include <string>
#include <vector>

class OSFileHandler : public IFileHandler {
public:
    std::string getBasePath() override; 
    void saveFile(const std::string& fileName, const std::string& content) override; 
    std::string readFile(const std::string& fileName) override; 
    std::vector<std::string> listFiles() override; 
    std::vector<std::string> findFiles(const std::string& fileContent) override;
};