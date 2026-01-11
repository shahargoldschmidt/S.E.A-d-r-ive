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

            client.setNoDelay(true);

            // Connect to the C++ Server
            client.connect(this.port, this.host, () => {
                console.log(`[TCP] Connected. Starting to send ${command.length} bytes...`);
                
                const payload = command + '\n';
                client.write(payload);
            });

            // Receive Data
           client.on('data', (data) => {
                responseData += data.toString();

                if (dataTimer) clearTimeout(dataTimer);

                if (_isResponseComplete(responseData)) {
                    console.log(`[TCP] Full response received (${responseData.length} bytes). Closing immediately.`);
                    client.end();
                    return; 
                }

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
