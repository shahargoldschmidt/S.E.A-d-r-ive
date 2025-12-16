// controllers/permissionController.js
const permissionModel = require('../models/permissionModel');

/**
 * Responsibilities: Manage file sharing and access levels.
 * All routes reaching this controller are protected by the 
 * requirePermission('ADMIN') middleware. 
 * Therefore, only the File Owner can execute these methods.
 */

/**
 * List all permissions for a file
 */
const getPermissions = async (req, res) => {
    try {
        const fileId = req.params.id;
        console.log(`[PermissionController] Fetching permissions for file: ${fileId}`);

        const permissions = await permissionModel.getPermissionsByFileId(fileId);
        
        // Status 200: OK
        res.status(200).json(permissions);
    } catch (error) {
        console.error(`[PermissionController] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 2. Add a new permission
 * Route: POST /api/files/:id/permissions
 * UML Name: addPermission
 */
const createPermission = async (req, res) => {
    try {
        const fileId = req.params.id;
        const { userId, type } = req.body; // Expecting target userId and permission type (VIEWER/EDITOR)

        // Validation: Ensure required fields are present
        if (!userId || !type) {
            return res.status(400).json({ error: "Target userId and permission type are required" });
        }

        // Validation: Ensure type is valid // להחליט ביחד סוגי הרשאות
        if (type !== 'VIEWER' && type !== 'EDITOR') {
            return res.status(400).json({ error: "Invalid permission type. Use 'VIEWER' or 'EDITOR'" });
        }

        console.log(`[PermissionController] Granting '${type}' to user ${userId} on file ${fileId}`);

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
 * UML Name: updatePermission
 */
const updatePermission = async (req, res) => {
    try {
        const { pId } = req.params; // Permission ID
        const { type } = req.body;  // New level (e.g., change VIEWER to EDITOR)

        if (!type || (type !== 'VIEWER' && type !== 'EDITOR')) {
            return res.status(400).json({ error: "Valid permission type is required" });
        }

        console.log(`[PermissionController] Updating permission ${pId} to '${type}'`);

        // Check if permission exists
        const existingPerm = await permissionModel.getPermissionById(pId);
        if (!existingPerm) {
            return res.status(404).json({ error: "Permission not found" });
        }

        const updatedPermission = await permissionModel.updatePermission(pId, type);
        
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
 * UML Name: deletePermissions (or removePermission)
 */
const deletePermission = async (req, res) => {
    try {
        const { pId } = req.params;

        console.log(`[PermissionController] Removing permission ${pId}`);

        // Check existence
        const existingPerm = await permissionModel.getPermissionById(pId);
        if (!existingPerm) {
            return res.status(404).json({ error: "Permission not found" });
        }

        await permissionModel.removePermission(pId);

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