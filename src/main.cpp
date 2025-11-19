#include "App.h"
#include "IMenu.h"
#include "ConsoleMenu.h"
#include "ICommand.h"
#include "AddFileCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "IFileHandler.h"
#include "ICompressor.h"
#include <map>
#include <string>
#include <iostream>
#include "OSFileHandler.h"
#include "RLEStrategy.h"
using namespace std;

int main() {
    IFileHandler* fileHandler = new OSFileHandler();
    ICompressor* compressor = new RLEStrategy();
    ostream& output = cout;
    istream& input = cin;

    ICommand* addCmd = new AddFileCommand(fileHandler, compressor);
    ICommand* getCmd = new GetCommand(fileHandler, compressor, output);
    ICommand* searchCmd = new SearchCommand(fileHandler, compressor, output);

    map<string, ICommand*> commands;
    commands["add"] = addCmd;
    commands["get"] = getCmd;
    commands["search"] = searchCmd;

    IMenu* menu = new ConsoleMenu(input, commands);

    App app(menu, commands);
    app.run();

    // Remember to delete/free resources if needed!
    return 0;
}
