const fileModel = require('../models/fileModel');
const permissionModel = require('../models/permissionModel');

/**
 * 
 * Get all ROOT files/folders for the current user.
 * only items where parentId is null (Top-level).
 * Route: GET /api/files
 */
const getFiles = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from Auth Middleware
        console.log(`[FileController] Getting root files for user: ${userId}`);

        // Fetch only root-level items from the model
        const files = await fileModel.getAccessibleRootFiles(userId);
        
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
        // Parent Validation: If parentId is provided, ensure it exists and is a FOLDER.
        if (fileData.parentId) {
            const parent = fileModel.getMetadata(fileData.parentId);
            // check that folder exists in data 
            if (!parent || parent.type !== 'folder') { 
                return res.status(400).json({ error: "Invalid parent folder ID: Parent must be an existing folder." });
            }
            // check permission to upload in a folder
            const hasWriteAccess = await permissionModel.hasPermission(
                userId, 
                fileData.parentId, 
                'WRITE'
            );
            if (!hasWriteAccess) {
                console.warn(`[Security] User ${userId} tried to create file in unauthorized folder ${fileData.parentId}`);
                return res.status(403).json({ error: "Access Denied: You do not have permission to write in this folder." });
            }
        }

        console.log(`[FileController] Creating item: ${fileData.name} (Type: ${fileData.type || 'file'})`);

        // Delegate creation to the model
        const newItem = await fileModel.create(userId, fileData);
        // create an admin permision to owner of the file
        await permissionModel.addPermission(newItem.id, userId, 'ADMIN');
        res.set('Location', `/api/files/${newItem.id}`);
        // Status 201: Created
        res.status(201).send();
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
        
        //  get information of item
        const targetMetadata = await fileModel.getMetadata(fileId);
        if (!targetMetadata) {
            return res.status(404).json({ error: "File or Folder not found" });
        }

        let allIdsToDelete = [];

        //.if a folder want s to be delted get all his children to delete
        if (targetMetadata.type === 'folder') {
            console.log(`[FileController] Recursive delete triggered for folder: ${fileId}`);
            allIdsToDelete = fileModel.getAllDescendantIds(fileId);
        } else {
            console.log(`[FileController] Single file delete triggered: ${fileId}`);
            allIdsToDelete = [fileId]; // 
        }

        // each id remove its permiisions and delete it
        for (const id of allIdsToDelete) {
            await permissionModel.removeAllPermissionsForFile(id);
            await fileModel.deleteSingleFile(id);
        }

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
        
        res.status(204).send();

    } catch (error) {
        console.error(`[FileController] Error in updateFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


/**
 * Search files by name (Node) and content (C++).
 * Route: GET /api/search/:query
 */
const searchFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const query = req.params.query;

        if (!query) {
            return res.status(400).json({ error: "Search query is missing" });
        }

        console.log(`[FileController] User ${userId} searching for: ${query}`);

        // search logic go to Model
        const results = await fileModel.searchFiles(userId, query);

        res.status(200).json(results);

    } catch (error) {
        console.error(`[FileController] Search Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getFiles,
    uploadFile,
    getFileData,
    deleteFile,
    updateFile, 
    searchFiles
};