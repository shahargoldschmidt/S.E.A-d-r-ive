/* server/services/permissionService.js */
const permissionModel = require('../models/permissionModel');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel'); // חובה לייבא כדי להמיר ID לאימייל

const ROLE_PERMISSIONS = {
    'VIEWER': ['READ'],
    'EDITOR': ['READ', 'WRITE', 'DELETE'],
    'ADMIN': ['READ', 'WRITE', 'DELETE', 'MANAGE']
};

// פונקציית העזר לבדיקת הרשאות (תוקנה הבעיה שזורקת את הבעלים)
const hasPermission = async (userId, fileId, actionType) => {
    let currentFileId = fileId;

    while (currentFileId != null) { 
        const file = await fileModel.getById(currentFileId);
        if (!file) throw Object.assign(new Error("File not found"), { name: "NOT_FOUND" });

        // 1. תיקון קריטי: המרה ל-String כדי למנוע באגים של מספר מול טקסט
        const fileOwner = String(file.owner);
        const currentUserId = String(userId);

        // אם המשתמש הוא הבעלים (בדיקה מול אימייל או מול ID)
        if (fileOwner === currentUserId || file.owner === userId) { 
            return true;
        }

        const permissions = await permissionModel.getPermissions(currentFileId);
        
        // 2. חיפוש ההרשאה עם המרה ל-String
        const userPerm = permissions.find(p => String(p.userId) === currentUserId); 

        if (userPerm) { 
            const allowedActions = ROLE_PERMISSIONS[userPerm.type] || [];
            if (allowedActions.includes(actionType)) { 
                return true;
            }
        }
        currentFileId = file.parentId;
    }
    return false;
};

// הוספת הרשאה
const createPermission = async (fileId, targetUserId, type) => {
    const item = await fileModel.getById(fileId);
    if (!item) throw new Error("File or Folder not found");
    
    const currentPermissions = await permissionModel.getPermissions(fileId);
    if (currentPermissions.find(p => String(p.userId) === String(targetUserId))) {
        throw new Error("User already has a permission for this item.");
    }

    return await permissionModel.createPermission(fileId, targetUserId, type);
};

// שליפת הרשאות (התיקון של השורה הריקה!)
const getPermissions = async (fileId) => {
    let currentFileId = fileId;
    const allPermissions = [];
    const seenUsers = new Set(); 

    while (currentFileId != null) {
        const file = await fileModel.getById(currentFileId);
        if (!file) break;

        const currentLevelPermissions = await permissionModel.getPermissions(currentFileId);

        for (const perm of currentLevelPermissions) {
            const sUserId = String(perm.userId);
            if (!seenUsers.has(sUserId)) {
                
                // --- התיקון הגדול: הבאת האימייל של המשתמש ---
                try {
                    const user = await userModel.getById(perm.userId);
                    if (user) {
                        // אנחנו מחזירים אובייקט משודרג שיש בו גם email
                        allPermissions.push({ 
                            ...perm, 
                            email: user.email 
                        }); 
                        seenUsers.add(sUserId);
                    }
                } catch (e) {
                    console.warn(`Could not fetch user info for permission ${perm.id}`);
                }
            }
        }
        currentFileId = file.parentId;
    }

    return allPermissions;
};

// שאר הפונקציות ללא שינוי
const updatePermission = async (pId, newType) => {
    return await permissionModel.updatePermission(pId, newType);
};

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