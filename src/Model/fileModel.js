const tcpClient = require('../services/tcpClientService');
const { v4: uuidv4 } = require('uuid'); // Install: npm install uuid

// In-Memory Storage for File Metadata
// Map Structure: <fileId, FileMetadataObject>
// Metadata Object: { id, owner, name, type, parentId, size, createdAt, content? }
const filesMetadata = new Map();

class FileModel {

    //  Helper Methods (Internal Use)

    /**
     * Helper: Retrieves all direct children
     *(files and sub-folders) of a specific folder.
     */
    _getDirectChildren(parentId) {
        const children = [];
        for (const file of filesMetadata.values()) {
            if (file.parentId === parentId) {
                children.push(file);
            }
        }
        return children;
    }

    /**
     * Helper: Fetches and formats content from the C++ TCP Server.
     */
    async _fetchContentFromTcp(fileId) {
        try {
            const response = await tcpClient.sendCommand(`get ${fileId}`);
            if (response.startsWith("200 Ok")) {
                // Extract content after the headers (double newline)
                return response.split("\n\n")[1] || "";
            }
            return "(Content unavailable)";
        } catch (error) {
            console.error(`[FileModel] TCP Error for ${fileId}: ${error.message}`);
            return "(Error fetching content)";
        }
    }

    //  Public Methods (API)

    /**
     * Retrieves root items (files/folders) for a specific user.
     * Filters items where parentId is NULL.
     */
    async getFilesByOwner(userId) {
        const userFiles = [];
        for (const file of filesMetadata.values()) {
            if (file.owner === userId && file.parentId === null) {
                userFiles.push(file);
            }
        }
        return userFiles;
    }

    /**
     * Creates a new file or folder.
     * - Folders: Saved only in Node.js memory.
     * - Files: Saved in memory AND sent to C++ server via TCP.
     */
    async create(userId, fileData) {
        const uniqueFileId = uuidv4();
        
        const type = fileData.type || 'file';
        const isFile = type === 'file';
        const parentId = fileData.parentId || null;
        const content = fileData.content || "";

        const newFileMeta = {
            id: uniqueFileId,
            owner: userId,
            name: fileData.name,
            type: type,
            parentId: parentId,
            size: isFile ? content.length : 0,
            createdAt: new Date().toISOString()
        };

        // If it's a file, send 'post' command to C++
        if (isFile) {
            try {
                const command = `post ${uniqueFileId} ${content}`;
                const response = await tcpClient.sendCommand(command);

                if (!response.includes("201")) {
                    throw new Error(`TCP Server Error: ${response}`);
                }
            } catch (error) {
                // If TCP fails, do not save metadata in memory
                throw new Error(`Failed to create file: ${error.message}`);
            }
        }

        // Save metadata to memory (Map)
        filesMetadata.set(uniqueFileId, newFileMeta);
        return newFileMeta;
    }

    /**
     * Retrieves file/folder data by ID.
     * - If Folder: Returns metadata + children array (with content for child files).
     * - If File: Returns metadata + content.
     */
    async getFileById(fileId) {
        const fileMeta = filesMetadata.get(fileId);
        if (!fileMeta) return null;

        // CASE 1: It is a FOLDER
        if (fileMeta.type === 'folder') {
            const children = this._getDirectChildren(fileId);
            
            // Use Promise.all to fetch content for all child files in parallel (Efficiency!)
            const childrenWithContent = await Promise.all(children.map(async (child) => {
                if (child.type === 'folder') {
                    return child; // Return folder metadata as is
                }
                // If child is a file, fetch its content
                const content = await this._fetchContentFromTcp(child.id);
                return { ...child, content };
            }));

            return { ...fileMeta, children: childrenWithContent };
        }

        // CASE 2: It is a FILE
        const content = await this._fetchContentFromTcp(fileId);
        return { ...fileMeta, content };
    }


    /**
     * Updates file metadata and content.
     * If content changes, it sends an 'update' command to the C++ server.
     */
    async update(fileId, updates) {
        const file = filesMetadata.get(fileId);
        if (!file) return null;

        // If it's a FILE and content is updated -> sync with C++
        if (file.type === 'file' && updates.content) {
            try {
                const cmd = `update ${fileId} ${updates.content}`;
                const response = await tcpClient.sendCommand(cmd);
                
                // Expecting 200 or 204 from C++
                if (!response.startsWith("200") && !response.startsWith("204")) {
                    throw new Error(`TCP Update failed: ${response}`);
                }
                updates.size = updates.content.length;
            } catch (error) {
                throw new Error(`Failed to update file in C++: ${error.message}`);
            }
        }

        // Update In-Memory Metadata
        const updatedFile = { ...file, ...updates };
        filesMetadata.set(fileId, updatedFile);
        return updatedFile;
    }

    /**
     * Recursive Delete.
     * Deletes the target item and ALL its descendants (children, grandchildren, etc.).
     * Cleans up both C++ storage (for files) and Node.js memory.
     */
    async deleteFile(fileId) {
        if (!filesMetadata.has(fileId)) return false;

        const allIdsToDelete = [];

        // Recursive helper to collect all descendant IDs
        const collectDescendants = (currentId) => {
            allIdsToDelete.push(currentId); // Add current item
            const children = this._getDirectChildren(currentId);
            for (const child of children) {
                collectDescendants(child.id); // Recurse
            }
        };

        // Gather all IDs
        collectDescendants(fileId);

        // Perform deletion
        for (const id of allIdsToDelete) {
            const meta = filesMetadata.get(id);
            
            // If it's a physical file, send delete command to C++
            if (meta && meta.type === 'file') {
                tcpClient.sendCommand(`delete ${id}`).catch(e => 
                    console.warn(`[FileModel] TCP Delete warning for ${id}: ${e.message}`)
                );
            }
            
            // Remove from memory
            filesMetadata.delete(id);
        }

        return true;
    }

    /*
    async searchFiles(userId, query) {
        // Feature currently disabled.
        // Implementation would use tcpClient.sendCommand(`search ${query}`)
    }
    */
}

module.exports = new FileModel();