const fileModel = require('../models/fileModel');
const permissionService = require('./permissionService');
const permissionModel = require('../models/permissionModel');
const crypto = require('crypto');

/**
 * Get root items accessible by user.
 */
const getFiles = async (userId) => {
    const allFiles = await fileModel.getFiles();
    const accessible = [];

    for (const file of allFiles) {
        if (file.parentId === null) {
            const hasAccess = await permissionService.hasPermission(userId, file.id, 'READ');
            if (hasAccess) accessible.push(file);
        }
    }
    return accessible;
};

/**
 * Validate parent folder and initialize permissions.
 */
const createFile = async (userId, fileData) => {
    const fileId = crypto.randomUUID();

    if (fileData.parentId) {
        const parent = await fileModel.getById(fileData.parentId);
        if (!parent || parent.type !== 'folder') {
            throw new Error("Invalid parent folder");
        }
        // Permission check for writing in folder
        const canWrite = await permissionService.hasPermission(userId, fileData.parentId, 'WRITE');
        if (!canWrite) throw new Error("Permission Denied: Cannot write to this folder");
    }

    const newItem = await fileModel.create(userId, fileId, fileData);
    await permissionService.createPermission(newItem.id, userId, 'ADMIN');
    return newItem;
};

/**
 * Fetch metadata Recursive children (folders) or Content (files).
 */
const getFileData = async (fileId) => {
    const meta = await fileModel.getById(fileId);
    if (!meta) return null;

    if (meta.type === 'folder') {
        const all = await fileModel.getFiles();
        const children = all.filter(f => f.parentId === fileId);
        return { ...meta, children };
    }
    
    const content = await fileModel.getTcpContent(fileId);
    return { ...meta, content };
};

/**
 * Collect all descendant IDs and perform clean recursive deletion.
 */
const deleteFile = async (fileId) => {
    const target = await fileModel.getById(fileId);
    if (!target) throw new Error("File or Folder not found");

    const idsToDelete = [];
    const allFiles = await fileModel.getFiles();

    const collect = (id) => {
        idsToDelete.push(id);
        allFiles.filter(f => f.parentId === id).forEach(child => collect(child.id));
    };
    collect(fileId);

    for (const id of idsToDelete) {
        await permissionModel.removeAllPermissionsForFile(id);
        await fileModel.deleteFile(id);
    }
};

/**
 * Orchestrate multi-source search and permission filtering.
 */
const searchFiles = async (userId, query) => {
    const resultsMap = new Map();
    const all = await fileModel.getFiles();

    // Metadata name match
    all.filter(f => f.name.includes(query)).forEach(f => resultsMap.set(f.id, f));

    // TCP content match
    const tcpIds = await fileModel.searchTcp(query);
    for (const id of tcpIds) {
        const meta = await fileModel.getById(id);
        if (meta) resultsMap.set(id, meta);
    }

    // Filter by permissions
    const finalResults = [];
    for (const item of resultsMap.values()) {
        const hasAccess = await permissionService.hasPermission(userId, item.id, 'READ');
        if (hasAccess) finalResults.push(item);
    }
    return finalResults;
};

const updateFile = async (fileId, updates) => {
    const file = await fileModel.getById(fileId); 
    if (!file) return null;
    
    if (file.type === 'folder' && updates.content !== undefined) {
        throw new Error("Invalid Operation: Only files can have content");
    }
    return await fileModel.update(fileId, updates);
};

module.exports = {
    getFiles,
    createFile,
    getFileData,
    deleteFile,
    searchFiles,
    updateFile
};