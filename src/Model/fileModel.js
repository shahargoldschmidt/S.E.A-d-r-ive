const tcpClient = require('../services/tcpClientService');
const { v4: uuidv4 } = require('uuid'); // Install: npm install uuid

// In-Memory Storage for File Metadata
// Map Structure: <fileId, FileMetadataObject>
// Metadata Object: { id, owner, name, size, createdAt }
const filesMetadata = new Map();

class FileModel {

    /**
     * Retrieves all files owned by a specific user from memory.
     */
    async getFilesByOwner(userId) {
        const userFiles = [];
        for (const file of filesMetadata.values()) {
            if (file.owner === userId) {
                userFiles.push(file);
            }
        }
        return userFiles;
    }

    /**
     * Creates a new file entry.
     * Process:
     * Generates a unique ID
     */
    async create(userId, fileData) {
        // Generate a unique ID for the system (mapping logical name to physical ID)
        const uniqueFileId = uuidv4(); 
        
        // Prepare Metadata
        const newFileMeta = {
            id: uniqueFileId,       // The internal ID used for C++ storage
            owner: userId,          // The owner's User ID
            name: fileData.name,    // Original display name
            size: fileData.content ? fileData.content.length : 0,
            createdAt: new Date().toISOString()
        };

        // Command format: "post <fileName> <content>"
        const content = fileData.content || "";
        const command = `post ${uniqueFileId} ${content}`;

        try {
            // Send to C++ Server
            const response = await tcpClient.sendCommand(command);
            
            // Validate Server Response (Expects "201 Created")
            if (response.includes("201 Created")) {
                filesMetadata.set(uniqueFileId, newFileMeta); // Commit to memory only on success
                return newFileMeta;
            } else {
                throw new Error(`TCP Server Error: ${response}`);
            }
        } catch (error) {
            throw new Error(`Failed to create file: ${error.message}`);
        }
    }

    /**
     * Retrieves file metadata and fetches content from the C++ server.
     * @param {string} fileId - The unique file ID.
     * @returns {Promise<Object|null>} File object with content, or null if not found.
     */
    async getFileById(fileId) {
        const fileMeta = filesMetadata.get(fileId);
        if (!fileMeta) return null;

        try {
            // TCP Command: "get <fileName>"
            const response = await tcpClient.sendCommand(`get ${fileId}`);
            
            // Expected Response: "200 Ok\n\n<content>"
            if (response.startsWith("200 Ok")) {
                // Extract content by splitting headers
                const content = response.split("\n\n")[1] || "";
                return { ...fileMeta, content: content };
            } else {
                // Sync Error: File exists in Metadata but missing in C++ Server
                console.error(`[FileModel] Sync error for ${fileId}: ${response}`);
                return { ...fileMeta, content: "(Content unavailable)" };
            }
        } catch (error) {
            throw new Error(`Failed to fetch file content: ${error.message}`);
        }
    }

    /**
     * Updates file metadata.
     * Note: Currently handles metadata updates in-memory.
     * If content update is required, logic to send 'update' command to C++ should be added.
     */
    async update(fileId, updates) {
        const file = filesMetadata.get(fileId);
        if (!file) return null;

        // TODO: If 'updates.content' exists, implement TCP update logic here.
        // E.g., await tcpClient.sendCommand(`update ${fileId} ${updates.content}`);

        // Update In-Memory Metadata
        const updatedFile = { ...file, ...updates };
        filesMetadata.set(fileId, updatedFile);
        return updatedFile;
    }

    /**
     * Deletes a file.
     * 1. Sends 'delete' command to C++ server.
     * 2. Removes metadata from Node.js memory.
     */
    async deleteFile(fileId) {
        if (!filesMetadata.has(fileId)) return false;

        try {
            // TCP Command: "delete <fileName>"
            const response = await tcpClient.sendCommand(`delete ${fileId}`);
            
            // Success (200/204) or Already Gone (404) -> We clean up memory in both cases
            if (response.includes("204") || response.includes("200") || response.includes("404")) {
                filesMetadata.delete(fileId); 
                return true;
            }
            
            return false;

        } catch (error) {
            console.error(`[FileModel] Delete error: ${error.message}`);
            return false;
        }
    }

    /**
     * Search for files containing a query string.
     * Utilizes the C++ server's 'search' command for content inspection.
     * @param {string} userId - Requesting user.
     * @param {string} query - Text to search for.
     * @returns {Promise<Array>} List of matching file objects.
     */
    async searchFiles(userId, query) {
        try {
            // TCP Command: "search <query>"
            const response = await tcpClient.sendCommand(`search ${query}`);
            
            if (!response.startsWith("200 Ok")) {
                return []; 
            }

            // Parse Response: "200 Ok\n\nid1 id2 id3 ..."
            const rawBody = response.split("\n\n")[1] || "";
            const foundIds = rawBody.trim().split(" "); // Split by space to get IDs

            const results = [];
            
            // Filter results: Match IDs with Metadata and verify Ownership/Permissions
            for (const id of foundIds) {
                const meta = filesMetadata.get(id);
                // Check if file exists in metadata and belongs to the user
                // Note: In a full implementation, check PermissionModel for shared files as well.
                if (meta && meta.owner === userId) {
                    results.push(meta);
                }
            }
            return results;

        } catch (error) {
            console.error(`[FileModel] Search error: ${error.message}`);
            return []; // Return empty array on failure
        }
    }
}

module.exports = new FileModel();