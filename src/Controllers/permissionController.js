const permissionService = require('../services/permissionService');

/**
 * 1. List all permissions for a specific file or folder
 */
const getPermissions = async (req, res) => {
    try {
        const fileId = req.params.id;
        console.log(`[PermissionController] Fetching permissions for item: ${fileId}`);

        
        const permissions = await permissionService.getPermissions(fileId);
        
        res.status(200).json(permissions);
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Add a new permission
 */
const createPermission = async (req, res) => {
    try {
        const fileId = req.params.id;
        const { userId, type } = req.body; 

        if (!userId || !type) {
            return res.status(400).json({ error: "Target userId and permission type are required" });
        }

        if (type !== 'VIEWER' && type !== 'EDITOR' && type !== 'ADMIN') {
            return res.status(400).json({ error: "Invalid permission type. Use 'VIEWER' or 'EDITOR'" });
        }

        console.log(`[PermissionController] Granting '${type}' to user ${userId} on item ${fileId}`);

        
        const newPermission = await permissionService.createPermission(fileId, userId, type);
        
        res.status(201).json(newPermission);
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(error.message.includes("already has") ? 409 : 500).json({ error: error.message });
    }
};

/**
 * Update an existing permission
 */
const updatePermission = async (req, res) => {
    try {
        const { pId } = req.params; 
        const { type } = req.body;

        if (!type || (type !== 'VIEWER' && type !== 'EDITOR' && type !== 'ADMIN')) {
            return res.status(400).json({ error: "Valid permission type (VIEWER/EDITOR) is required" });
        }

        console.log(`[PermissionController] Updating permission ${pId} to '${type}'`);

        
        const updatedPermission = await permissionService.updatePermission(pId, type);
        
        if (!updatedPermission) {
            return res.status(404).json({ error: "Permission not found" });
        }
        
        res.status(200).json(updatedPermission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Remove a permission
 */
const deletePermission = async (req, res) => {
    try {
        const { pId } = req.params;

        console.log(`[PermissionController] Removing permission ${pId}`);

        const wasDeleted = await permissionService.deletePermission(pId);

        if (!wasDeleted) {
            return res.status(404).json({ error: "Permission not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission
};