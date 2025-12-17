const fileModel = require('../models/fileModel');

/**
 * Get all ROOT files/folders for the current user.
 * only items where parentId is null (Top-level).
 * Route: GET /api/files
 */
const getFiles = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from Auth Middleware
        console.log(`[FileController] Getting root files for user: ${userId}`);

        // Fetch only root-level items from the model
        const files = await fileModel.getFilesByOwner(userId);
        
        res.status(200).json(files); 
    } catch (error) {
        console.error(`[FileController] Error in getFiles: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Upload a new file OR Create a new folder.
 * Expects body: { name, type, parentId?, content? }
 * Route: POST /api/files
 */
const uploadFile = async (req, res) => {
    try {
        const userId = req.userId;
        const fileData = req.body; 
        
        // Basic Validation
        if (!fileData.name) {
            return res.status(400).json({ error: "Name is required" });
        }
        // if wants to write in a folder' checks it has premiision to upload in folder
        if (fileData.parentId) {
            const hasWriteAccess = await permissionModel.hasPermission(
                userId, 
                fileData.parentId, 
                'WRITE' // Creation requires WRITE permission
            );

            if (!hasWriteAccess) {
                console.warn(`[Security] User ${userId} tried to create file in unauthorized folder ${fileData.parentId}`);
                return res.status(403).json({ error: "Access Denied: You do not have permission to write in this folder." });
            }
        }

        // Parent Validation: If parentId is provided, ensure it exists and is a FOLDER.
        // We do this check here to return a specific 400 Bad Request error.
        if (fileData.parentId) {
            const parent = fileModel.getMetadata(fileData.parentId);
            
            // Check if parent doesn't exist OR if parent is actually a file (cannot contain children)
            if (!parent || parent.type === 'file') {
                return res.status(400).json({ error: "Invalid parent folder ID: Parent must be an existing folder." });
            }
        }

        console.log(`[FileController] Creating item: ${fileData.name} (Type: ${fileData.type || 'file'})`);

        // Delegate creation to the model
        const newItem = await fileModel.create(userId, fileData);
        
        // Status 201: Created
        res.status(201).json(newItem);
    } catch (error) {
        console.error(`[FileController] Error in uploadFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get specific file data OR Folder contents.
 * If File: Returns metadata + content.
 * If Folder: Returns metadata + list of children.
 * Route: GET /api/files/:id
 */
const getFileData = async (req, res) => {
    try {
        const fileId = req.params.id;

        // Model handles fetching content for files / children for folders
        const file = await fileModel.getFileById(fileId);
        
        // If model returns null, the item does not exist
        if (!file) {
            return res.status(404).json({ error: "File or Folder not found" });
        }

        console.log(`[FileController] Retrieved item: ${file.name} (Type: ${file.type})`);
        
        res.status(200).json(file);
        
    } catch (error) {
        console.error(`[FileController] Error in getFileData: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete a file or folder (Recursivly).
 * Route: DELETE /api/files/:id
 */
const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id;

        console.log(`[FileController] Deleting item: ${fileId}`);
        
        // Perform recursive delete via model
        const wasDeleted = await fileModel.deleteFile(fileId);

        if (!wasDeleted) {
            // If false, it means the ID was not found in memory
            return res.status(404).json({ error: "File or Folder not found" });
        }

        // (Standard for successful delete)
        res.status(204).send(); 
    } catch (error) {
        console.error(`[FileController] Error in deleteFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update a file or folder.
 * Handles renaming (folders/files) and content updates (files only).
 * Route: PATCH /api/files/:id
 */
const updateFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const updates = req.body;

        console.log(`[FileController] Updating item: ${fileId}`);

        // Direct update call to model (no pre-check needed)
        const updatedItem = await fileModel.update(fileId, updates);
        
        // If model returns null, item wasn't found
        if (!updatedItem) {
            return res.status(404).json({ error: "File or Folder not found" });
        }
        
        res.status(200).json(updatedItem); 

    } catch (error) {
        console.error(`[FileController] Error in updateFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getFiles,
    uploadFile,
    getFileData,
    deleteFile,
    updateFile
};