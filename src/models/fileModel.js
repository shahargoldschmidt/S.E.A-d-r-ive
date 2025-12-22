const tcpClient = require('../services/tcpClientService');
const crypto = require('crypto');

// In-Memory Storage
const filesMetadata = new Map();

// Retrieves all metadata objects from memory no filter.
const getFiles = async () => {
    return Array.from(filesMetadata.values());
};

// Retrieves a single metadata object if exists
const getById = async (fileId) => {
    return filesMetadata.get(fileId) || null;
};

// create file/folder and add to metadata. 
const create = async (userId, fileId, fileData) => {
    const isFile = fileData.type === 'file';
    const content = fileData.content || "";

    const newFileMeta = {
        id: fileId,
        owner: userId,
        name: fileData.name,
        type: fileData.type,
        parentId: fileData.parentId || null,
        size: isFile ? content.length : 0,
        createdAt: new Date().toISOString()
    };
    // add to tcp if its a file
    if (isFile) {
        const command = `post ${fileId} ${content}`;
        const response = await tcpClient.sendCommand(command);
        if (!response.includes("201")) {
            throw new Error(`TCP Storage Error: ${response}`);
        }
    }
    //add to metadata
    filesMetadata.set(fileId, newFileMeta);
    return newFileMeta;
};

// Updates metadata for name and TCP for content.
const update = async (fileId, updates) => {
    const file = filesMetadata.get(fileId);
    if (!file) return null;

    // if there is a change in the content 
    if (updates.content !== undefined) {
        
        // Get the current content from the C++ storage before making any changes
        const oldContent = await getTcpContent(fileId);

        try {
            // Delete the existing file from the C++ storage server
            await tcpClient.sendCommand(`delete ${fileId}`);

            // Attempt to upload the new content
            const response = await tcpClient.sendCommand(`post ${fileId} ${updates.content}`);

            // Verify if the C++ server returned a "201 Created" success code
            if (!response.includes("201")) {
                throw new Error(`TCP Error: ${response}`);
            }

            // Success: Update local metadata like file size
            updates.size = updates.content.length;
            // Remove content from the updates object so it is not saved in the metadata Map
            delete updates.content;

        } catch (e) {
            //ROLLBACK: If the new upload fails, try to restore the original data
            console.error(`[Rollback] Update failed, restoring old content: ${e.message}`);

            // Send the original content back to the C++ server
            await tcpClient.sendCommand(`post ${fileId} ${oldContent}`);

            // Throw an error so the Controller can notify the user that the update failed
            throw new Error(`Critical: Content update failed. Old content was restored.`);
        }
    }

    // Update the metadata in the local Map
    const updatedFile = { ...file, ...updates };
    filesMetadata.set(fileId, updatedFile);
    return updatedFile;
};

// Deletes from Map and TCP.
const deleteFile = async (id) => {
    const meta = filesMetadata.get(id);
    if (!meta) return false;
    //if its a file delte also from TCP
    if (meta.type === 'file') {
        await tcpClient.sendCommand(`delete ${id}`);
    }

    return filesMetadata.delete(id);
};

// Fetches matching IDs from the C++ Server. 
const searchTcp = async (query) => {
    try {
        const response = await tcpClient.sendCommand(`search ${query}`);
        if (response.startsWith("200 Ok")) {
            const rawBody = response.split("\n\n")[1] || "";
            return rawBody.trim().split(" ").filter(id => id !== "");
        }
    } catch (e) {
        console.warn(`[FileModel] TCP Search connection warning: ${e.message}`);
    }
    return [];
};

// Fetches content for a specific file from TCP.
const getTcpContent = async (fileId) => {
    const response = await tcpClient.sendCommand(`get ${fileId}`);
    if (response.startsWith("200 Ok")) {
        return response.split("\n\n")[1] || "";
    }
    return "(Content not found on storage server)";
};

module.exports = {
    getFiles,
    getById,
    create,
    update,
    deleteFile,
    searchTcp,
    getTcpContent
};