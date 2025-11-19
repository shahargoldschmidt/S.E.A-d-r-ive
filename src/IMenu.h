#ifndef IMENU_H
#define IMENU_H

#include <string>
#include "CommandInput.h"

// Interface for any menu that gathers user commands
class IMenu {
public:
    virtual ~IMenu() = default;
    virtual CommandInput getInput() = 0; // gets input regardlees of the source
};
#endif 
