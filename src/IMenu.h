#ifndef IMENU_H
#define IMENU_H

#include <string>
/**
 * This interface defines how any menu in the CLI should behave.
 * The main responsibilities:
 * Get command input from the user.
 */
class IMenu {
public:
    virtual ~IMenu() = default;
    virtual std::string getInput() = 0; // gets input regardlees of the source
};
#endif 
