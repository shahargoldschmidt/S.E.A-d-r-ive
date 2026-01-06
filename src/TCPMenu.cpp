#include "TCPMenu.h"
#include <sys/socket.h>
#include <unistd.h>
#include <cstring>
#include <iostream>

using namespace std;

TCPMenu::TCPMenu(int socket) : m_socket(socket) {}

// 👇 זו הפונקציה החדשה שתתקן את קליטת התמונות 👇
string TCPMenu::getInput() {
    string fullInput = "";  // משתנה דינמי שיאגור את כל המידע
    char buffer[4096];      // באפר זמני לכל "ביס"

    while (true) {
        // ניקוי הבאפר לפני כל קריאה
        memset(buffer, 0, sizeof(buffer));

        // קריאת חתיכה מהרשת
        int bytesRead = recv(m_socket, buffer, sizeof(buffer) - 1, 0);

        // אם יש שגיאה או שהלקוח התנתק
        if (bytesRead <= 0) {
            if (fullInput.length() > 0) {
                // אם הספקנו לקרוא משהו לפני הניתוק, נחזיר אותו
                return fullInput;
            }
            return ""; // ניתוק מלא
        }

        // הוספת החתיכה שקראנו למחרוזת הגדולה
        fullInput.append(buffer, bytesRead);

        // הבדיקה הקריטית: האם הגענו לסוף הפקודה? (ירידת שורה)
        // Node.js שולח עכשיו \n בסוף כל פקודה
        if (fullInput.find('\n') != string::npos) {
            break; // סיימנו לקרוא!
        }
    }

    return fullInput;
}

void TCPMenu::respond(string message) {
    message += "\n";
    send(m_socket, message.c_str(), message.length(), 0); //sending response
}