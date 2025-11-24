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
    // create file handler and compressor
    IFileHandler* fileHandler = new OSFileHandler();
    ICompressor* compressor = new RLEStrategy();

    // set input/output streams
    ostream& output = cout;
    istream& input = cin;

    // create commands (will be deleted by App)
    ICommand* addCmd = new AddFileCommand(fileHandler, compressor);
    ICommand* getCmd = new GetCommand(fileHandler, compressor, output);
    ICommand* searchCmd = new SearchCommand(fileHandler, compressor, output);

    // put commands in a map
    map<string, ICommand*> commands;
    commands["add"] = addCmd;
    commands["get"] = getCmd;
    commands["search"] = searchCmd;

    // create menu
    IMenu* menu = new ConsoleMenu(input, commands);

    // create app and run it
    App app(menu, commands);

    try {
        app.run();
    } catch (...) {
        // Handle stopping the infinite loop gracefully
    }
    
    // delete what main own
    delete menu; 
    delete fileHandler;
    delete compressor;
    
    return 0;
}