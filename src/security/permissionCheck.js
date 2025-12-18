const permissionModel = require('../models/permissionModel');

/**
 * Middleware: Checks recursive permissions.
 * @param {string} actionType - 'READ' or 'WRITE' or 'DELETE'
 */
const requirePermission = (actionType) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId; 
            const fileId = req.params.id;

            if (!fileId) {
                return res.status(400).json({ error: "File ID is missing" });
            }
            
            if (file.owner === userId) {
                console.log(`[Security] Owner access granted for user ${userId} on ${fileId}`);
                return next();
            }
            const hasAccess = await permissionModel.hasPermission(userId, fileId, actionType);
            
            if (!hasAccess) {
                return res.status(403).json({ error: "Access Denied" });
            }

            next();
        } catch (error) {
            console.error(`[PermissionMiddleware] Error: ${error.message}`);
            res.status(500).json({ error: "Permission check failed" });
        }
    };
};

module.exports = { requirePermission };