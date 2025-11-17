#include "AddFileCommand.h"
#include <sstream>

AddFileCommand::AddFileCommand(IFileHandler* fh, ICompressor* comp)
    : fileHandler(fh), compressor(comp) {}

void AddFileCommand::execute(const std::string& input) {

    if (input.empty())
        return; // אסור להדפיס שגיאה

    std::stringstream ss(input);

    std::string fileName;
    ss >> fileName;

    if (fileName.empty())
        return; // אסור להדפיס שגיאה

    std::string content;
    std::getline(ss, content);

    // להיפטר מהרווח הראשון
    if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);

    std::string compressed = compressor->compress(content);

    fileHandler->saveFile(fileName, compressed);
}
