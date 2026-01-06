/* server/services/tcpClientService.js */
const net = require('net');

class TcpClientService {
    constructor() {
        this.host = process.env.CPP_SERVER_HOST || '127.0.0.1' || 'cpp_server' ; 
        this.port = parseInt(process.env.CPP_SERVER_PORT) || 5555; 
        this.timeout = 40000;
    }

    // Establishes a connection, sends a command, waits for a response, and closes the connection
    sendCommand(command) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let responseData = ''; // Buffer for accumulating chunks
            let dataTimer = null;

            // אופטימיזציה: ביטול עיכובים של המערכת (Nagle) כדי שהשליחה תהיה מיידית
            client.setNoDelay(true);

            // Connect to the C++ Server
            // 1. התחברות לשרת
            client.connect(this.port, this.host, () => {
                console.log(`[TCP] Connected. Starting to send ${command.length} bytes...`);
                
                // --- השינוי: שליחה ישירה במכה אחת (בלי Chunks ידניים) ---
                // אנחנו נותנים ל-Node.js לנהל את הזרמת המידע.
                // זה מונע מצב שהשרת C++ חושב שסיימנו באמצע בגלל הפסקה קטנה בין מנות.
                const payload = command + '\n';
                client.write(payload);
            });

            // Receive Data
           client.on('data', (data) => {
                responseData += data.toString();

                // ניקוי הטיימר הקודם כדי שלא יכבה לנו את החיבור באמצע
                if (dataTimer) clearTimeout(dataTimer);

                // --- התיקון: בדיקה מיידית ---
                // אם לפי הפרוטוקול סיימנו לקבל את כל המידע (למשל יש \n בסוף)
                // אין סיבה לחכות אפילו מילישנייה נוספת!
                if (_isResponseComplete(responseData)) {
                    console.log(`[TCP] Full response received (${responseData.length} bytes). Closing immediately.`);
                    client.end();
                    return; // יציאה כדי לא להפעיל את הטיימר למטה
                }

                // --- רשת ביטחון (Fallback) ---
                // רק אם אנחנו לא בטוחים שזה הסוף (למשל באמצע תמונה גדולה),
                // נפעיל טיימר שיסגור את החיבור אם יש "שקט" של 2 שניות.
                dataTimer = setTimeout(() => {
                    console.log('[TCP] Silence detected, assuming end of stream.');
                    client.end();
                }, 2000); 
            });

            // Close connection
            client.on('end', () => { // Resolve only after full data is received
                const cleanResponse = responseData.trim();
                console.log(`[TCP] Received response length: ${cleanResponse.length}`);
                resolve(cleanResponse); 
            });

            // Handle Errors
            client.on('error', (err) => {
                console.error('[TCP] Connection Error:', err.message);
                reject(new Error(`Failed to connect to C++ Server: ${err.message}`));
            });

            // Handle Timeout
            client.setTimeout(this.timeout, () => {
                if (dataTimer) clearTimeout(dataTimer);
                client.destroy(); 
                reject(new Error('TCP Connection Timeout'));
            });
        });
    }
}

// helper to encapsulates the logic of identifying a complete C++ response
function _isResponseComplete(data) {
    // Short responses (201, 204, 400, 404, 500) ending with a single \n
    const shortResponsePattern = /^(201|204|400|404|500).*\n$/;
    
    // Long responses (200 OK) starting with header 
    const longResponsePattern = /^200 Ok\n\n[\s\S]*\n$/;

    // Return true if the data matches either of the standard protocol patterns
    return shortResponsePattern.test(data) || longResponsePattern.test(data);
}

// Export as a Singleton
module.exports = new TcpClientService();