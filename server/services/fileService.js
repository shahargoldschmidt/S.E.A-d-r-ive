const fileModel = require('../models/fileModel');
const permissionService = require('./permissionService');
const permissionModel = require('../models/permissionModel');
const userService = require('../services/userService');


/* fileService.js */

// Fetch files: supports global fetch (all=true) or root-level only (all=false)
const getFiles = async (userId, all = false) => {
    const allFiles = await fileModel.getFiles();
    const user = await userService.getUser(userId);
    const accessibleFiles = [];
    
    for (const file of allFiles) {
        // Check if user is the owner or has explicit READ permission
        const isOwner = String(file.owner) === String(userId) || file.owner === user.email;
        const hasAccess = isOwner || await permissionService.hasPermission(userId, file.id, 'READ');

        if (hasAccess) {
            const perms = await permissionService.getPermissions(file.id);
            const fileObj = file.toJSON ? file.toJSON() : file;
            
            accessibleFiles.push({ ...fileObj, permissions: perms });        }
    }

    // If 'all' is true, return everything accessible (for Starred/Trash/Shared)
    if (all) return accessibleFiles; 
    
    // Otherwise, return only root-level items (for Home tab)
    return accessibleFiles.filter(file => file.parentId === null); 
};

// Fetch folder content with individual permission checks for each child

const getFileData = async (userId, fileId) => {
    const meta = await fileModel.getById(fileId);
    if (!meta) return null;

    if (meta.type === 'folder') {
        const all = await fileModel.getFiles();
        const children = all.filter(f => f.parentId === fileId);
        const accessibleChildren = [];

        for (const child of children) {
            const user = await userService.getUser(userId);
            const hasAccess = (String(child.owner) === String(userId) || child.owner === user.email) || 
                              await permissionService.hasPermission(userId, child.id, 'READ');
            
            if (hasAccess) {
                const perms = await permissionService.getPermissions(child.id);
                const childObj = child.toJSON ? child.toJSON() : child; 
                accessibleChildren.push({ ...childObj, permissions: perms });   
            }
        }
        const metaObj = meta.toJSON ? meta.toJSON() : meta;
        return { ...metaObj, children: accessibleChildren };
    }
    
    const content = await fileModel.getTcpContent(fileId);
    const metaObj = meta.toJSON(); 
    return { ...metaObj, content };
};

 // Validate parent folder and initialize permissions.
const createFile = async (userId, fileData) => {
    const user = await userService.getUser(userId);
    if (!user) throw new Error("User not found");

    if (fileData.parentId) {
        const parent = await fileModel.getById(fileData.parentId);
        if (!parent) throw new Error("Parent folder not found");
        if (parent.type !== 'folder') throw new Error("Parent must be a folder");
        
        const canWrite = await permissionService.hasPermission(userId, fileData.parentId, 'WRITE');
        if (!canWrite) throw new Error("Permission Denied: Cannot write to this folder");
    }
    const newFile = await fileModel.create(user.email, null, fileData); 
    await permissionService.createPermission(newFile.id, userId, 'ADMIN');

    return newFile;
};


// Collect all descendant IDs and perform clean recursive deletion.
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

 // Orchestrate multi-source search and permission filtering
const searchFiles = async (userId, query) => {
    const resultsMap = new Map();
    // Fetch all files from the database to ensure global search depth
    const allFiles = await fileModel.getFiles(); 

    // 1. Search by Name (Metadata) - Case-insensitive for better UX
    allFiles
        .filter(f => String(f.name || "").toLowerCase().includes(query.toLowerCase()))
        .forEach(f => resultsMap.set(String(f.id), f));

    // 2. Search by Content via TCP Storage Server
    // Note: fileModel.searchTcp already returns a list of File documents
    const tcpResults = await fileModel.searchTcp(query); 
    for (const fileObj of tcpResults) { 
        const sid = String(fileObj.id);
        
        // Skip if the file was already matched by name to avoid duplicates
        if (resultsMap.has(sid)) continue; 

        // Skip images as they don't have searchable text content in this context
        if (fileObj.type === 'image') continue;

        // Verify content match if the query accidentally matched the File ID string
        if (sid.includes(query)) {
            const actualContent = await fileModel.getTcpContent(sid);
            if (actualContent.includes(query)) {
                resultsMap.set(sid, fileObj);
            }
        } else {
            // Found via TCP content index
            resultsMap.set(sid, fileObj);
        }
    }

    // 3. Permission Filtering and Data Transformation
    const finalResults = [];
    for (const item of resultsMap.values()) {
        // Only include files where the user has at least READ permission
        const hasAccess = await permissionService.hasPermission(userId, item.id, 'READ');
        if (hasAccess) {
            const perms = await permissionService.getPermissions(item.id);
            
            // Convert Mongoose Document to plain JSON to preserve the virtual 'id' field
            // This prevents 'undefined' errors and duplicate keys in the React Native UI
            const itemObj = item.toJSON ? item.toJSON() : item; 
            
            finalResults.push({ 
                ...itemObj, 
                permissions: perms 
            });
        }
    }
    
    return finalResults;
};
// Update folder only by name or file by name and content
const updateFile = async (userId, fileId, updates) => {
    const file = await fileModel.getById(fileId); 
    if (!file) return null;

    const canWrite = await permissionService.hasPermission(userId, fileId, 'WRITE');
    if (!canWrite) {
        throw new Error("Permission Denied: You do not have write access to this file");
    }

    // cant update a folders content
    if (file.type === 'folder' && updates.content !== undefined) {
        throw new Error("Invalid Operation: Only files can have content");
    }

    // move file to a different folder
    if (updates.parentId) {
        // check that it's a folder
        const newParent = await fileModel.getById(updates.parentId);
        if (!newParent || newParent.type !== 'folder') {
            throw new Error("Invalid parent folder: Target does not exist or is not a folder");
        }

        // Does the user have Permission to write in the target folder
        const hasWriteAccessToFolder = await permissionService.hasPermission(userId, updates.parentId, 'WRITE');
        if (!hasWriteAccessToFolder) {
            throw new Error("Permission Denied: You do not have write access to the target folder");
        }
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