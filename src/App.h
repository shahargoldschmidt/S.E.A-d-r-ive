#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include "ICommand.h"
#include <map>
#include <string>

class App {
private:
    IMenu* menu;  
    std::map<std::string, ICommand*> commands;  

public:
    App(IMenu* menu, const std::map<std::string, ICommand*>& commands);

    // Explicitly declares the destructor. Required for manual memory cleanup (delete).
    ~App() = default;
    
    // Prevents object copying (Copy Constructor).
    App(const App&) = delete; 
    // Prevents object assignment (Copy Assignment Operator).
    App& operator=(const App&) = delete;

    void run();  // infinite loop

};

#endif