// controllers/permissionController.js
const permissionModel = require('../models/permissionModel');

/**
 * Responsibilities: Manage file/folder sharing and access levels.
 * All routes reaching this controller are protected by middleware
 * ensuring only the Owner (or Admin) can execute these methods.
 */

/**
 * 1. List all permissions for a specific file or folder
 * Route: GET /api/files/:id/permissions
 */
const getPermissions = async (req, res) => {
    try {
        const fileId = req.params.id;
        console.log(`[PermissionController] Fetching permissions for item: ${fileId}`);

        const permissions = await permissionModel.getPermissionsByFileId(fileId);
        
        // Status 200: OK
        res.status(200).json(permissions);
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 2. Add a new permission (Share item)
 * Route: POST /api/files/:id/permissions
 */
const createPermission = async (req, res) => {
    try {
        const fileId = req.params.id;
        // Expecting target userId and permission type (VIEWER/EDITOR)
        const { userId, type } = req.body; 

        // Validation: Ensure required fields are present
        if (!userId || !type) {
            return res.status(400).json({ error: "Target userId and permission type are required" });
        }

        // Validation: Ensure type is valid
        if (type !== 'VIEWER' && type !== 'EDITOR') {
            return res.status(400).json({ error: "Invalid permission type. Use 'VIEWER' or 'EDITOR'" });
        }

        console.log(`[PermissionController] Granting '${type}' to user ${userId} on item ${fileId}`);

        const newPermission = await permissionModel.addPermission(fileId, userId, type);
        
        // Status 201: Created
        res.status(201).json(newPermission);
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 3. Update an existing permission
 * Route: PATCH /api/files/:id/permissions/:pId
 */
const updatePermission = async (req, res) => {
    try {
        const { pId } = req.params; // Permission ID
        const { type } = req.body;  // New level (e.g., change VIEWER to EDITOR)

        // Validate type
        if (!type || (type !== 'VIEWER' && type !== 'EDITOR')) {
            return res.status(400).json({ error: "Valid permission type (VIEWER/EDITOR) is required" });
        }

        console.log(`[PermissionController] Updating permission ${pId} to '${type}'`);

        // Update directly via Model (Model should return null if not found)
        const updatedPermission = await permissionModel.updatePermission(pId, type);
        
        if (!updatedPermission) {
            return res.status(404).json({ error: "Permission not found" });
        }
        
        // Status 200: OK
        res.status(200).json(updatedPermission);

    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 4. Remove a permission (Unshare)
 * Route: DELETE /api/files/:id/permissions/:pId
 */
const deletePermission = async (req, res) => {
    try {
        const { pId } = req.params;

        console.log(`[PermissionController] Removing permission ${pId}`);

        // Remove directly via Model (Model returns boolean success/fail)
        const wasDeleted = await permissionModel.removePermission(pId);

        if (!wasDeleted) {
            return res.status(404).json({ error: "Permission not found" });
        }

        // Status 204: No Content
        res.status(204).send();
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission
};