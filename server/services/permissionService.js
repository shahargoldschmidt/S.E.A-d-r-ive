const permissionModel = require('../models/permissionModel');
const fileModel = require('../models/fileModel');
//all types of permisions and their abilities
const ROLE_PERMISSIONS = {
    'VIEWER': ['READ'],
    'EDITOR': ['READ', 'WRITE', 'DELETE'],
    'ADMIN': ['READ', 'WRITE', 'DELETE', 'MANAGE']
};

// Checks if a user has permission for a specific action either for a file or for a folder .
const hasPermission = async (userId, fileId, actionType) => {
    let currentFileId = fileId;

    while (currentFileId != null) { 
        const file = await fileModel.getById(currentFileId);
        if (!file) throw Object.assign(new Error("File not found"), { name: "NOT_FOUND" });

        if (file.owner === userId) { // if user is the owner permission is granted automaticaly
            return true;
        }
        //get all premision for a file
        const permissions = await permissionModel.getPermissions(currentFileId);
        //search for users premision in that file
        const userPerm = permissions.find(p => String(p.userId) === String(userId)); 

        if (userPerm) { //search for users authorities in his premision
            const allowedActions = ROLE_PERMISSIONS[userPerm.type] || [];
            if (allowedActions.includes(actionType)) { 
                return true;
            }
        }
        //climb the hierachy to check folder premissions 
        currentFileId = file.parentId;
    }
    return false;
};

//add a premission
const createPermission = async (fileId, targetUserId, type) => {
    const item = await fileModel.getById(fileId);
    if (!item) throw new Error("File or Folder not found");
    // check if a premision already exists for user
    const currentPermissions = await permissionModel.getPermissions(fileId);
    if (currentPermissions.find(p => p.userId === targetUserId)) {
        throw new Error("User already has a permission for this item.");
    }

    return await permissionModel.createPermission(fileId, targetUserId, type);
};

// get all permission objects for a file, including those inherited from parent folders
const getPermissions = async (fileId) => {
    let currentFileId = fileId;
    const allPermissions = [];
    const seenUsers = new Set(); // To avoid duplicates if a user has permissions in multiple levels

    while (currentFileId != null) {
        // Get the file/folder object to find its parent
        const file = await fileModel.getById(currentFileId);
        if (!file) break;

        // Get permissions defined at this specific level
        const currentLevelPermissions = await permissionModel.getPermissions(currentFileId);

        // Add permissions to the list if we haven't seen this user yet
        for (const perm of currentLevelPermissions) {
            if (!seenUsers.has(perm.userId)) {
                allPermissions.push(perm); // Returns the original object without extra fields
                seenUsers.add(perm.userId);
            }
        }

        // Move up to the parent folder
        currentFileId = file.parentId;
    }

    return allPermissions;
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