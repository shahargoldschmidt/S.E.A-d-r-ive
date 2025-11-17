#include "AddFileCommand.h"
#include <sstream>
#include <string>


AddFileCommand::AddFileCommand(IFileHandler* fh, ICompressor* comp)
    : fileHandler(fh), compressor(comp) {}

void AddFileCommand::execute(const std::string& input) {

    // if there is nothing after the command keep going without save file and warning
    if (input.empty())
        return;

    // separate the input
    std::stringstream ss(input);

    // The first word is the file name
    std::string fileName;
    ss >> fileName;

    // Reject empty file name
    if (fileName.empty())
        return;

    std::string content;
    // Reads the rest of the line, including leading whitespace after the file name
    std::getline(ss, content);

    // Remove only the **single leading space** left by std::getline
    if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);

    // Do NOT trim trailing spaces, leave them as-is
    // This way, content like "    " is preserved

    std::string compressed = compressor->compress(content);

    fileHandler->saveFile(fileName, compressed);
}
