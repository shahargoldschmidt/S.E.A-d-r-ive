const fileModel = require('../models/fileModel');
const permissionService = require('./permissionService');
const permissionModel = require('../models/permissionModel');
const userService = require('../services/userService');
const crypto = require('crypto');


//  Get root items the user has premission to  root level
const getFiles = async (userId) => {
    const allFiles = await fileModel.getFiles();
    const user = await userService.getUser(userId);
    const userEmail = user.email;

    const accessibleIds = new Set();
    const accessibleFiles = [];
    
    for (const file of allFiles) {
        let hasAccess = false;
        
        const isOwner = String(file.owner) === String(userId) || file.owner === userEmail;
        if (isOwner) {
            hasAccess = true;
        } else {
            hasAccess = await permissionService.hasPermission(userId, file.id, 'READ');
        }

        if (hasAccess) {
            accessibleIds.add(file.id); 
            accessibleFiles.push(file);   
        }
    }

    const resultList = [];

    for (const file of accessibleFiles) { 
        const isOwner = String(file.owner) === String(userId) || file.owner === userEmail;
        let shouldInclude = false;

        if (isOwner) {
            if (file.parentId === null) shouldInclude = true;
        } else {
            const isParentAccessible = file.parentId && accessibleIds.has(file.parentId);
            
            if (!isParentAccessible) shouldInclude = true;
        }

        if (shouldInclude) {
            const perms = await permissionService.getPermissions(file.id);
            resultList.push({ ...file, permissions: perms });
        }
    }

    return resultList;
};

 // Validate parent folder and initialize permissions.
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
    const userEmail = await userService.getUser(userId);
    const email = userEmail.email;
    const newItem = await fileModel.create(email, fileId, fileData);
    await permissionService.createPermission(newItem.id, userId, 'ADMIN'); //add admin permission for owner
    return newItem;
};

// Fetch metadata Recursive children (folders) or Content (files).
const getFileData = async (fileId) => {
    const meta = await fileModel.getById(fileId);
    if (!meta) return null;

    const selfPermissions = await permissionService.getPermissions(fileId);
    const metaWithPerms = { ...meta, permissions: selfPermissions };

    if (meta.type === 'folder') { //if folder get all its children from first level
        const all = await fileModel.getFiles();
        const children = all.filter(f => f.parentId === fileId);
        
        const childrenWithPermissions = await Promise.all(children.map(async (child) => {
            const perms = await permissionService.getPermissions(child.id);
                return { ...child, permissions: perms };
        }));
                
        return { ...metaWithPerms, children: childrenWithPermissions };  
    }

    //else get content of file
    const content = await fileModel.getTcpContent(fileId);
    return { ...meta, content };
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
    const all = await fileModel.getFiles();

    // name match by metadata
    all.filter(f => f.name.includes(query)).forEach(f => resultsMap.set(f.id, f));

    // content match by TCP
    const tcpIds = await fileModel.searchTcp(query);
    for (const id of tcpIds) { 
        if (resultsMap.has(id)) continue; //If the file was already matched by name, skip

        const meta = await fileModel.getById(id);
        if (!meta) continue;
        if (meta.type === 'image') continue;
        //edge case If the query is a substring of the ID 
        // might have matched by name and not content in TCP
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
        if (hasAccess) {
            const perms = await permissionService.getPermissions(item.id);
            finalResults.push({ ...item, permissions: perms });
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