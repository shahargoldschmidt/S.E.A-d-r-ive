#include <string>
#include <vector>

class IFileHandler {
public:
    virtual ~IFileHandler() = default;

    // קורא את הנתיב לשמירה/קריאה ממשתנה הסביבה.
    virtual std::string getBasePath() = 0; 

    // שומר את התוכן (הדחוס) לקובץ בנתיב המלא.
    virtual void saveFile(const std::string& fileName, const std::string& content) = 0; 

    // read
    virtual std::string readFile(const std::string& fileName) = 0; 
    
    // סורק את תיקיית האחסון ומחזיר רשימה של כל שמות הקבצים.
    virtual std::vector<std::string> listFiles() = 0; 

    // מחפש קבצים המכילים תוכן מסוים בתוך הקבצים שנסרקו.
    // הערה: פונקציה זו תשתמש ב-readFile ו-ICompressor, אך היא נדרשת עבור פקודת Search.
    // מכיוון שזו פונקציה מורכבת, נשאיר אותה כאן כחלק מהחוזה לקבצים.
    // (אפשר גם להעביר את לוגיקת החיפוש ל-SearchFilesCommand)
    virtual std::vector<std::string> findFiles(const std::string& fileContent) = 0;
};