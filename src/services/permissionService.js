const permissionModel = require('../models/permissionModel');
const fileModel = require('../models/fileModel');

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

    while (currentFileId) {
        const file = fileModel.getMetadata(currentFileId);
        if (!file) return false;

        if (file.owner === userId) {
            return true;
        }

        const permissions = await permissionModel.getPermissions(currentFileId);
        const userPerm = permissions.find(p => p.userId === userId); 

        if (userPerm) {
            const allowedActions = ROLE_PERMISSIONS[userPerm.type] || [];
            if (allowedActions.includes(actionType)) {
                return true;
            }
        }
        currentFileId = file.parentId;
    }
    return false;
};

const createPermission = async (fileId, targetUserId, type) => {
    const item = fileModel.getMetadata(fileId);
    if (!item) throw new Error("File or Folder not found");

    const currentPermissions = await permissionModel.getPermissions(fileId);
    if (currentPermissions.find(p => p.userId === targetUserId)) {
        throw new Error("User already has a permission for this item.");
    }

    return await permissionModel.createPermission(fileId, targetUserId, type);
};


const getPermissions = async (fileId) => {
    return await permissionModel.getPermissions(fileId);
};


const updatePermission = async (pId, newType) => {
    return await permissionModel.updatePermission(pId, newType);
};


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