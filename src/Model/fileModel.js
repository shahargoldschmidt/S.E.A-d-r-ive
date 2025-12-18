const tcpClient = require('../services/tcpClientService');
const crypto = require('crypto');

// In-Memory Storage
const filesMetadata = new Map();

/**
 * Retrieves all metadata objects from memory.
 */
const getFiles = async () => {
    return Array.from(filesMetadata.values());
};

/**
 * Retrieves a single metadata object. 
 * Validation: Checks if the ID exists in the Map.
 */
const getById = async (fileId) => {
    return filesMetadata.get(fileId) || null;
};

/**
 * Raw creation logic .
 */
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

    if (isFile) {
        const command = `post ${fileId} ${content}`;
        const response = await tcpClient.sendCommand(command);
        if (!response.includes("201")) {
            throw new Error(`TCP Storage Error: ${response}`);
        }
    }

    filesMetadata.set(fileId, newFileMeta);
    return newFileMeta;
};

/**
 * Updates metadata and/or TCP content.
 */
const update = async (fileId, updates) => {
    const file = filesMetadata.get(fileId);
    if (!file) return null;

    if (file.type === 'file' && updates.content) {
        const cmd = `update ${fileId} ${updates.content}`;
        const response = await tcpClient.sendCommand(cmd);
        if (!response.startsWith("200") && !response.startsWith("204")) {
            throw new Error("TCP Content Update failed");
        }
        updates.size = updates.content.length;
    }

    const updatedFile = { ...file, ...updates };
    filesMetadata.set(fileId, updatedFile);
    return updatedFile;
};

/**
 * Deletes from Map and TCP.
 */
const deleteFile = async (id) => {
    const meta = filesMetadata.get(id);
    if (!meta) return false;

    if (meta.type === 'file') {
        await tcpClient.sendCommand(`delete ${id}`);
    }
    
    return filesMetadata.delete(id);
};

/**
 * Fetches matching IDs from the C++ Server.
 */
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

/**
 * Fetches content for a specific file from TCP.
 */
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