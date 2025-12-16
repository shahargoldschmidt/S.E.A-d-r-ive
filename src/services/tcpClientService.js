// services/tcpClientService.js
const net = require('net');

class TcpClientService {
    constructor() {
        this.port = 8080;      // Ensure this matches your C++ Server port
        this.host = '127.0.0.1';
        this.timeout = 5000;   // 5 Seconds timeout
    }

    /**
     * Establishes a connection, sends a command, waits for a response, and closes the connection
     * This implements a "Short-lived Connection" pattern to ensure atomic transactions.
     */
    sendCommand(command) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let responseData = '';

            //Connect to the C++ Server
            client.connect(this.port, this.host, () => {
                console.log(`[TCP] Sending: ${command}`);
                // so a newline character is required to trigger the read
                client.write(command + '\n');
            });

            // Receive Data
            client.on('data', (data) => {
                responseData += data.toString();
                // initiate the disconnect as soon as we get data
                client.end(); 
            });

            //close connection
            client.on('end', () => {
                const cleanResponse = responseData.trim();
                console.log(`[TCP] Received: ${cleanResponse}`);
                resolve(cleanResponse); // send response to controller
            });

            // Handle Errors of server
            client.on('error', (err) => {
                console.error('[TCP] Connection Error:', err.message);
                reject(new Error(`Failed to connect to C++ Server: ${err.message}`));
            });

            // Handle Timeout
            client.setTimeout(this.timeout, () => {
                client.destroy(); // Force kill the socket
                reject(new Error('TCP Connection Timeout'));
            });
        });
    }
}

// Export as a Singleton to prevent multiple service instances
module.exports = new TcpClientService();