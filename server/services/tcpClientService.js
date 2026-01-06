// services/tcpClientService.js
const net = require('net');

class TcpClientService {
    constructor() {
        this.host = process.env.CPP_SERVER_HOST || '127.0.0.1' || 'cpp_server' ; 
        this.port = parseInt(process.env.CPP_SERVER_PORT) || 5555; 
        this.timeout = 5000;
    }

    // Establishes a connection, sends a command, waits for a response, and closes the connection
    sendCommand(command) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let responseData = ''; // Buffer for accumulating chunks

            // Connect to the C++ Server
            client.connect(this.port, this.host, () => {
                console.log(`[TCP] Sending: ${command}`);
                // so a newline character is required to trigger the read
                client.write(command + '\n');
            });

            // Receive Data
            client.on('data', (data) => {
                responseData += data.toString(); // Accumulate data to avoid cutting

                // check if the message is complete based on the protocol
                if (_isResponseComplete(responseData)) {
                    client.end(); // Trigger the 'end' event manually
                }
            });

            // Close connection
            client.on('end', () => { // Resolve only after full data is received
                const cleanResponse = responseData.trim();
                console.log(`[TCP] Received: ${cleanResponse}`);
                resolve(cleanResponse); 
            });

            // Handle Errors
            client.on('error', (err) => {
                console.error('[TCP] Connection Error:', err.message);
                reject(new Error(`Failed to connect to C++ Server: ${err.message}`));
            });

            // Handle Timeout
            client.setTimeout(this.timeout, () => {
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