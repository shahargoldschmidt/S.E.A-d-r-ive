
const permissionService = require('../services/permissionService');

// a security check by type of action neede before accesing a function 
const requirePermission = (actionType) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId; 
            const fileId = req.params.id;

            if (!fileId) {
                return res.status(400).json({ error: "File ID is missing" });
            }

            const hasAccess = await permissionService.hasPermission(userId, fileId, actionType);
            
            if (!hasAccess) {
                console.warn(`[Security] Access Denied for user ${userId} on item ${fileId}`);
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