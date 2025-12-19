const permissionModel = require('../models/permissionModel');
const fileModel = require('../models/fileModel');
//all types of permisions and their abilities
const ROLE_PERMISSIONS = {
    'VIEWER': ['READ'],
    'EDITOR': ['READ', 'WRITE', 'DELETE'],
    'ADMIN': ['READ', 'WRITE', 'DELETE', 'MANAGE']
};

/**
 * Checks if a user has permission by climbing the folder hierarchy.
 */
const hasPermission = async (userId, fileId, actionType) => {
    let currentFileId = fileId;

    while (currentFileId) { //go up the hierachy
        const file = fileModel.getMetadata(currentFileId);
        if (!file) return false;

        if (file.owner === userId) { // if user is the owner permission is granted automaticaly
            return true;
        }
        //get all premision for a file
        const permissions = await permissionModel.getPermissions(currentFileId);
        //search for users premision in that file
        const userPerm = permissions.find(p => p.userId === userId); 

        if (userPerm) { //search for users authorities in his premision
            const allowedActions = ROLE_PERMISSIONS[userPerm.type] || [];
            if (allowedActions.includes(actionType)) { 
                return true;
            }
        }
        //climb the hierachy
        currentFileId = file.parentId;
    }
    return false;
};

//add a premission
const createPermission = async (fileId, targetUserId, type) => {
    const item = fileModel.getMetadata(fileId);
    if (!item) throw new Error("File or Folder not found");
    // check if a premision already exists for user
    const currentPermissions = await permissionModel.getPermissions(fileId);
    if (currentPermissions.find(p => p.userId === targetUserId)) {
        throw new Error("User already has a permission for this item.");
    }

    return await permissionModel.createPermission(fileId, targetUserId, type);
};

//get all premisions for a file
const getPermissions = async (fileId) => {
    return await permissionModel.getPermissions(fileId);
};

//update an existing premision
const updatePermission = async (pId, newType) => {
    return await permissionModel.updatePermission(pId, newType);
};

//remove a premission
const deletePermission = async (pId) => {
    return await permissionModel.deletePermission(pId);
};

module.exports = { 
    hasPermission,
    createPermission,
    getPermissions,
    updatePermission,
    deletePermission
};