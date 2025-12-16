// middlewares/permissionMiddleware.js
const permissionModel = require('../models/permissionModel');

/**
 * Middleware: Checks if the user has the required permission for the requested file.
 */
const requirePermission = (actionType) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId; 
            const fileId = req.params.id;

            // Check if the user has the specific permission in the model
            const hasAccess = await permissionModel.hasPermission(userId, fileId, actionType);
            
            if (!hasAccess) {
                return res.status(403).json({ error: "Access Denied" });
            }

            // Permission granted, proceed to the controller
            next();
        } catch (error) {
            console.error(`[PermissionMiddleware] Error: ${error.message}`);
            res.status(500).json({ error: "Permission check failed" });
        }
    };
};

module.exports = { requirePermission };