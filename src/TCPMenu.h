#ifndef TCPMENU_H
#define TCPMENU_H

#include "IMenu.h"
#include <string>

class TCPMenu : public IMenu {
private:
    int m_socket; // clients socket

public:
    explicit TCPMenu(int socket);
    virtual ~TCPMenu() = default;

    std::string getInput() override;
    void respond(std::string message) override;
};

#endif