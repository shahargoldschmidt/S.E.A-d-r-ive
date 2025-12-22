const crypto = require('crypto');

// In-Memory Storage for Permissions
const permissionsStore = new Map();

//get all premision for a file
const getPermissions = async (fileId) => { 
    const result = [];
    for (const perm of permissionsStore.values()) {
        if (perm.fileId === fileId) {
            result.push(perm);
        }
    }
    return result;
};

//create a premision and add to map
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

// Updates an existing permission level
const updatePermission = async (pId, newType) => { 
    const perm = permissionsStore.get(pId);
    if (!perm) return null;
    //change premision type
    const updatedPerm = { ...perm, type: newType };
    permissionsStore.set(pId, updatedPerm);
    return updatedPerm;
};
// remove specific premision
const deletePermission = async (pId) => { 
    if (!permissionsStore.has(pId)) {
        return false;
    }
    permissionsStore.delete(pId);
    return true;
};
// remove all the permisions for a file 
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