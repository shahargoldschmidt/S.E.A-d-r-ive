#include "App.h"
#include "IMenu.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <map>
#include <string>
#include <iostream>

int main() {
    IFileHandler* fileHandler = new OSFileHandler();
    ICompressor* compressor = new RLEStrategy();
    std::ostream& output = std::cout;
    std::istream& input = std :: cin;

    ICommand* addCmd = new AddFileCommand(fileHandler, compressor);
    ICommand* getCmd = new GetCommand(fileHandler, compressor, output);
    ICommand* searchCmd = new SearchCommand(fileHandler, compressor, output);

    std::map<std::string, ICommand*> commands;
    commands["add"] = addCmd;
    commands["get"] = getCmd;
    commands["search"] = searchCmd;

    IMenu* menu = new ConsoleMenu(input, commands);

    App app(menu, commands);
    app.run();

    // Remember to delete/free resources if needed!
    return 0;
}
