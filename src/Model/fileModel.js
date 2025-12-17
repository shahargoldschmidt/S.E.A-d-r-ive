const tcpClient = require('../services/tcpClientService');
const crypto = require('crypto');

// In-Memory Storage for File Metadata
// Map Structure: <fileId, FileMetadataObject>
// Metadata Object: { id, owner, name, type, parentId, size, createdAt, content? }
const filesMetadata = new Map();

    //  Helper Methods

    /**
     * Helper: Retrieves all direct children
     * (files and sub-folders) of a specific folder.
     */
    const _getDirectChildren = (parentId) => { 
        const children = [];
        for (const file of filesMetadata.values()) {
            if (file.parentId === parentId) {
                children.push(file);
            }
        }
        return children;
    };

    /**
     * Helper: Fetches and formats content from the C++ TCP Server.
     */
    const _fetchContentFromTcp = async (fileId) => {
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
    };

    //Helper: Retrieves file metadata directly from memory
    const getMetadata = (fileId) => { // * CHANGED: 'const' instead of method
        return filesMetadata.get(fileId) || null;
    };

    //  Public Methods (API)

    /**
     * Retrieves root items (files/folders) for a specific user.
     * Filters items where parentId is NULL.
     */
   const getAccessibleRootFiles = async (userId) => { 
        const permissionModel = require('./permissionModel'); 
    
        const accessibleFiles = [];
        for (const file of filesMetadata.values()) {
            if (file.parentId !== null) continue;

            if (file.owner === userId) {
                 accessibleFiles.push(file);
                 continue;
             }

            const hasAccess = await permissionModel.hasPermission(userId, file.id, 'READ');
            if (hasAccess) {
                accessibleFiles.push(file);
             }
    }
    return accessibleFiles;
};

    /**
     * Creates a new file or folder.
     * - Folders: Saved only in Node.js memory.
     * - Files: Saved in memory AND sent to C++ server via TCP.
     */
    const create = async (userId, fileData) => { 
        const uniqueFileId = crypto.randomUUID();;
        const name = fileData.name;
        const parentId = fileData.parentId || null;
        
        const type = fileData.type ;
        if (type !== 'file' && type !== 'folder') {
            throw new Error(`Invalid type: '${type}'. Allowed types are 'file' or 'folder'.`);
        }
        const isFile = type === 'file';
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
    };

    /**
     * Retrieves file/folder data by ID.
     * - If Folder: Returns metadata + children array (with content for child files).
     * - If File: Returns metadata + content.
     */
    const getFileById = async (fileId) => { 
        const fileMeta = filesMetadata.get(fileId);
        if (!fileMeta) return null;

        // if It is a FOLDER
        if (fileMeta.type === 'folder') {
            const children = _getDirectChildren(fileId); 
            
            return { ...fileMeta, children: children };
        }

        // if It is a FILE
        const content = await _fetchContentFromTcp(fileId); 
        return { ...fileMeta, content };
    };


    /**
     * Updates file metadata and content.
     * If content changes, it sends an 'update' command to the C++ server.
     */
    const update = async (fileId, updates) => { 
        const file = getMetadata(fileId); 

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
    };

    /**
     * Recursive Delete.
     * Deletes the target item and ALL its descendants (children, grandchildren, etc.).
     * Cleans up both C++ storage (for files) and Node.js memory.
     */
    const deleteFile = async (fileId) => { // * CHANGED: 'const' instead of method
        if (!filesMetadata.has(fileId)) return false;

        const allIdsToDelete = [];

        // Recursive helper to collect all descendant IDs
        const collectDescendants = (currentId) => {
            allIdsToDelete.push(currentId); // Add current item
            const children = _getDirectChildren(currentId); // * CHANGED: Removed 'this.'
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
    };


     // Search files by logical name (Node.js) AND content (C++).
     // ONLY returns files the user has permission to view.
    const searchFiles = async (userId, query) => {
        // Use a Map to prevent duplicates (Key - File ID, Value -  File Object)
        const resultsMap = new Map();

        // Search by Name (In-Memory) Iterate all files in memory
        for (const file of filesMetadata.values()) {
            // Check if name matches query
            if (file.name.includes(query)) {
                // Check permissions: Is owner OR has 'READ' permission
                const hasAccess = (file.owner === userId) || await permissionModel.hasPermission(userId, file.id, 'READ');
                
                if (hasAccess) {
                    resultsMap.set(file.id, file);
                }
            }
        }

        // Search by Content (C++)
        try {
            // C++ searches physical files and it returns a list of IDs where the content was found.
            const response = await tcpClient.sendCommand(`search ${query}`);
            
            if (response.startsWith("200 Ok")) {
                const rawBody = response.split("\n\n")[1] || "";
                const foundIds = rawBody.trim().split(" "); 

                for (const id of foundIds) {
                    if (!id) continue;
                    
                    const meta = filesMetadata.get(id);
                    // If file exists in metadata 
                    if (meta) {
                        // Check permissions for these files
                        const hasAccess = (meta.owner === userId) || await permissionModel.hasPermission(userId, meta.id, 'READ');
                        
                        if (hasAccess) {
                            resultsMap.set(meta.id, meta);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`[FileModel] Search warning (C++ might be empty or error): ${error.message}`);
        }

        // Convert Map values to array
        return Array.from(resultsMap.values());
    };

module.exports = {
    _getDirectChildren, 
    _fetchContentFromTcp, 
    getMetadata,
    getAccessibleRootFiles,
    create,
    getFileById,
    update,
    deleteFile,
    searchFiles 
};;