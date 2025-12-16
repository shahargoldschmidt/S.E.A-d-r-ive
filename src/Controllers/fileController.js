// controllers/fileController.js
const fileModel = require('../models/fileModel');

/**
 * Get all files for the current user
 * Route: GET /api/files
 */
const getFiles = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(`[FileController] Getting files for user: ${userId}`);

        // Retrieve files owned by the user
        const files = await fileModel.getFilesByOwner(userId);
        
        res.status(200).json(files); 
    } catch (error) {
        console.error(`[FileController] Error in getFiles: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Upload a new file
 * Route: POST /api/files
 */
const uploadFile = async (req, res) => {
    try {
        const userId = req.userId;
        const fileData = req.body; 
        
        // Validation: Ensure 'name' is provided (Per assignment spec)
        if (!fileData.name) {
            return res.status(400).json({ error: "Name is required" });
        }

        console.log(`[FileController] Uploading file for user: ${userId}`);

        const newFile = await fileModel.create(userId, fileData);
        
        // Status 201: Created
        res.status(201).json(newFile);
    } catch (error) {
        console.error(`[FileController] Error in uploadFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 3. Get specific file data
 * Route: GET /api/files/:id
 */
const getFileData = async (req, res) => {
    try {
        const fileId = req.params.id;

        const file = await fileModel.getFileById(fileId);
        
        // Handle case where file does not exist
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        console.log(`[FileController] Retrieved file: ${fileId}`);
        
        // Status 200: OK
        res.status(200).json(file);
    } catch (error) {
        console.error(`[FileController] Error in getFileData: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 4. Delete a file
 * Route: DELETE /api/files/:id
 */
const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id;

        // Verify file existence before attempting delete
        const file = await fileModel.getFileById(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        console.log(`[FileController] Deleting file: ${fileId}`);
        await fileModel.deleteFile(fileId);

        // Status 204: No Content
        res.status(204).send(); 
    } catch (error) {
        console.error(`[FileController] Error in deleteFile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

/**
 * 5. Update a file
 */
const updateFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const updates = req.body;

        console.log(`[FileController] Updating file: ${fileId}`);

        // Verify existence
        const file = await fileModel.getFileById(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Perform update
        const updatedFile = await fileModel.update(fileId, updates);
        
        res.status(200).json(updatedFile); 

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