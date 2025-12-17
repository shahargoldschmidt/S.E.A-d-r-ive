const fileModel = require('./fileModel'); 
const { v4: uuidv4 } = require('uuid'); // Install: npm install uuid

// In-Memory Storage for Permissions
// Map Structure: <permissionId, PermissionObject>
// Permission Object: { id, fileId, userId, type }
const permissionsStore = new Map();

    /**
     * Retrieves all permissions associated with a specific file or folder.
     * @param {string} fileId - The ID of the file/folder.
     * @returns {Promise<Array>} List of permission objects.
     */
    const getPermissionsByFileId = async (fileId) => { 
        const result = [];
        for (const perm of permissionsStore.values()) {
            if (perm.fileId === fileId) {
                result.push(perm);
            }
        }
        return result;
    };

    /**
     * Grants a new permission to a user for a file/folder.
     * Note: Does not currently check for duplicates (e.g., if user already has permission).
     * @param {string} fileId - The item ID.
     * @param {string} userId - The target user ID.
     * @param {string} type - 'VIEWER' or 'EDITOR'.
     * @returns {Promise<Object>} The created permission object.
     */
    const addPermission = async (fileId, userId, type) => {
        //check if user already have a permission 
        const currentPermissions = await getPermissionsByFileId(fileId);
        const exists = currentPermissions.find(p => p.userId === userId);
        
        if (exists) {
            throw new Error("User already has a permission for this item.");
        }

        const uniqueId = uuidv4();

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
     * Updates an existing permission level (e.g., VIEWER -> EDITOR).
     * @param {string} pId - The permission ID.
     * @param {string} newType - The new permission type.
     * @returns {Promise<Object|null>} The updated object, or null if not found.
     */
    const updatePermission = async (pId, newType) => { 
        const perm = permissionsStore.get(pId);
        
        // If permission does not exist, return null so controller can return 404
        if (!perm) return null;

        // Create updated object
        const updatedPerm = { ...perm, type: newType };
        
        // Save back to storage
        permissionsStore.set(pId, updatedPerm);
        
        return updatedPerm;
    };

    /**
     * Removes a permission (Unshare).
     * @param {string} pId - The permission ID.
     * @returns {Promise<boolean>} True if deleted, False if ID was not found.
     */
    const removePermission = async (pId) => { 
        if (!permissionsStore.has(pId)) {
            return false;
        }

        permissionsStore.delete(pId);
        return true;
    };

    /**
     * Helper: Get a single permission by ID.
     * Useful for internal checks or middleware.
     */
    const getPermissionById = async (pId) => { 
        return permissionsStore.get(pId) || null;
    };

    /**
     * Checks if a user has permission to perform an action on a file.
     * Implements "Permission Inheritance": checks the file, then its parent, grandparent, etc.
     * * @param {string} userId - The user asking for access.
     * @param {string} fileId - The target file/folder ID.
     * @param {string} actionType - 'READ' (needs Viewer/Editor) or 'WRITE' (needs Editor).
     * @returns {Promise<boolean>} True if access is granted.
     */
    const hasPermission = async (userId, fileId, actionType) => {
        let currentFileId = fileId;

    // Loop upwards until we reach the root (null)
        while (currentFileId) {
            // Get file metadata to check Owner and find Parent
            const file = fileModel.getMetadata(currentFileId);
            if (!file) return false;

            // owner always has all permissions
            if (file.owner === userId) {
                return true;
            }

            // Check explicit permissions for this specific level
            const permissions = await getPermissionsByFileId(currentFileId);
            //search userId in list of premissions
            const userPerm = permissions.find(p => p.userId === userId); 

            if (userPerm) {
                // check what kind of prmission
                const role = userPerm.type; // 'VIEWER' or 'EDITOR'
                if (actionType === 'WRITE' || actionType === 'DELETE') {
                    // Writing and deleting requires EDITOR
                    if (role === 'EDITOR') return true;
                } else {
                    // Reading ('READ') allows both VIEWER and EDITOR
                    if (actionType === 'READ')
                    return true;
                }
                return false; 
            }
            // Climb up to the parent folder to see if theres premission for folders
            currentFileId = file.parentId;
        }
        // Reached the top and found no matching permissions
        return false;
    };

module.exports = {
    getPermissionsByFileId,
    addPermission,
    updatePermission,
    removePermission,
    getPermissionById,
    hasPermission
};