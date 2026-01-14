/* server/services/permissionService.js */
const permissionModel = require('../models/permissionModel');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');

const ROLE_PERMISSIONS = {
    'VIEWER': ['READ'],
    'EDITOR': ['READ', 'WRITE', 'DELETE'],
    'ADMIN': ['READ', 'WRITE', 'DELETE', 'MANAGE']
};

const hasPermission = async (userId, fileId, actionType) => {
    let currentFileId = fileId;

    while (currentFileId != null) { 
        const file = await fileModel.getById(currentFileId);
        if (!file) throw Object.assign(new Error("File not found"), { name: "NOT_FOUND" });

        if (String(file.owner) === String(userId)) { 
            return true;
        }

        const permissions = await permissionModel.getPermissions(currentFileId);
        
        const userPerm = permissions.find(p => String(p.userId) === String(userId));

        if (userPerm) {
            if (checkPermissionLevel(userPerm.type, actionType)) {
                return true;
            }
        }
        currentFileId = file.parentId;
    }
    return false;
};

const checkPermissionLevel = (userRole, actionType) => {
    return ROLE_PERMISSIONS[userRole]?.includes(actionType);
};

const createPermission = async (fileId, targetUserId, type) => {
    const item = await fileModel.getById(fileId);
    if (!item) throw new Error("File or Folder not found");
    
    const currentPermissions = await permissionModel.getPermissions(fileId);
    
    if (currentPermissions.find(p => String(p.userId) === String(targetUserId))) {
        throw new Error("User already has a permission for this item.");
    }

    return await permissionModel.createPermission(fileId, targetUserId, type);
};

const getPermissions = async (fileId) => {
    let currentFileId = fileId;
    const allPermissions = [];
    const seenUsers = new Set(); 

    while (currentFileId != null) {
        const file = await fileModel.getById(currentFileId);
        if (!file) break;

        const currentLevelPermissions = await permissionModel.getPermissions(currentFileId);

        for (const perm of currentLevelPermissions) {
            const sUserId = String(perm.userId);
            if (!seenUsers.has(sUserId)) {
                
                try {
                    const user = await userModel.getById(perm.userId);
                    if (user) {
                        const permObj = perm.toJSON ? perm.toJSON() : perm;
                        
                        allPermissions.push({ 
                            ...permObj, 
                            email: user.email 
                        }); 
                        seenUsers.add(sUserId);
                    }
                } catch (e) {
                    console.warn(`Could not fetch user info for permission ${perm.id}`);
                }
            }
        }
        currentFileId = file.parentId;
    }

    return allPermissions;
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
