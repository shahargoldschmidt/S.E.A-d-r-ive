#include <string>
#include <vector>

class IFileHandler {
public:
    virtual ~IFileHandler() = default;
    virtual std::string getBasePath() = 0; 

    virtual void saveFile(const std::string& fileName, const std::string& content) = 0; 

    virtual std::string readFile(const std::string& fileName) = 0; 
    
    virtual std::vector<std::string> listFiles() = 0; 

    virtual std::vector<std::string> findFiles(const std::string& fileContent) = 0;
};
