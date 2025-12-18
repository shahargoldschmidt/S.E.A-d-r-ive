const crypto = require('crypto');

// In-Memory Storage for Permissions
const permissionsStore = new Map();


const getPermissions = async (fileId) => { 
    const result = [];
    for (const perm of permissionsStore.values()) {
        if (perm.fileId === fileId) {
            result.push(perm);
        }
    }
    return result;
};


const createPermission = async (fileId, userId, type) => {
    const uniqueId = crypto.randomUUID();

    const newPermission = {
        id: uniqueId,
        fileId: fileId,
        userId: userId,
        type: type
    };

    permissionsStore.set(uniqueId, newPermission);
    return newPermission;
};

/**
 * Updates an existing permission level
 */
const updatePermission = async (pId, newType) => { 
    const perm = permissionsStore.get(pId);
    if (!perm) return null;

    const updatedPerm = { ...perm, type: newType };
    permissionsStore.set(pId, updatedPerm);
    return updatedPerm;
};

const deletePermission = async (pId) => { 
    if (!permissionsStore.has(pId)) {
        return false;
    }
    permissionsStore.delete(pId);
    return true;
};

const removeAllPermissionsForFile = async (fileId) => {
    for (const [pId, perm] of permissionsStore.entries()) {
        if (perm.fileId === fileId) {
            permissionsStore.delete(pId);
        }
    }
};

module.exports = {
    getPermissions, 
    createPermission, 
    updatePermission, 
    deletePermission, 
    removeAllPermissionsForFile 
};