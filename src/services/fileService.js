const fileModel = require('../models/fileModel');
const permissionService = require('./permissionService');
const permissionModel = require('../models/permissionModel');
const crypto = require('crypto');

/**
 * Get root items the user has premission to  root level
 */
const getFiles = async (userId) => {
    const allFiles = await fileModel.getFiles();
    const accessible = []; // array to store all accesible items

    for (const file of allFiles) {
        if (file.parentId === null) { //check for root items only
            const hasAccess = await permissionService.hasPermission(userId, file.id, 'READ');
            if (hasAccess) accessible.push(file); //if item acccesible to user add to array
        }
    }
    return accessible;
};

/**
 * Validate parent folder and initialize permissions.
 */
const createFile = async (userId, fileData) => {
    const fileId = crypto.randomUUID();

    if (fileData.parentId) { //if user wants to write file in a folder check folder exists
        const parent = await fileModel.getById(fileData.parentId);
        if (!parent || parent.type !== 'folder') {
            throw new Error("Invalid parent folder");
        }
        // Permission check for writing in the folder
        const canWrite = await permissionService.hasPermission(userId, fileData.parentId, 'WRITE');
        if (!canWrite) throw new Error("Permission Denied: Cannot write to this folder");
    }

    const newItem = await fileModel.create(userId, fileId, fileData);
    await permissionService.createPermission(newItem.id, userId, 'ADMIN'); //add admin permission for owner
    return newItem;
};

/**
 * Fetch metadata Recursive children (folders) or Content (files).
 */
const getFileData = async (fileId) => {
    const meta = await fileModel.getById(fileId);
    if (!meta) return null;

    if (meta.type === 'folder') { //if folder get all its children from first level
        const all = await fileModel.getFiles();
        const children = all.filter(f => f.parentId === fileId);
        return { ...meta, children };
    }
    //else get content of file
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
    const allFiles = await fileModel.getFiles(); //
    //collect all items descendants
    const collect = (id) => {
        idsToDelete.push(id);
        allFiles.filter(f => f.parentId === id).forEach(child => collect(child.id));
    };
    collect(fileId);
    //delete each descendant and delete its premisions
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

    // name match by metadata
    all.filter(f => f.name.includes(query)).forEach(f => resultsMap.set(f.id, f));

    // content match by TCP
    const tcpIds = await fileModel.searchTcp(query);
    for (const id of tcpIds) { 
        if (resultsMap.has(id)) continue; //If the file was already matched by name, skip

        const meta = await fileModel.getById(id);
        //edge case If the query is a substring of the ID 
        // might have matched by name and not content
        if (id.includes(query)) {
            // fetch the actual content to verify the match
            const actualContent = await fileModel.getTcpContent(id);
            if (actualContent.includes(query)) { //only after match is verified add to map
                resultsMap.set(id, meta);
            }
        } else {
            // If the query is in the ID, it must have been found in the content
            resultsMap.set(id, meta);
        }
    }

    // Filter by permissions, only files with its premissions will show to user
    const finalResults = [];
    for (const item of resultsMap.values()) {
        const hasAccess = await permissionService.hasPermission(userId, item.id, 'READ');
        if (hasAccess) finalResults.push(item);
    }
    return finalResults;
};
//update folder only by name or filr by name and content
const updateFile = async (fileId, updates) => {
    const file = await fileModel.getById(fileId); 
    if (!file) return null;
    //cant update a folders content
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