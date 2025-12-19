const fileService = require('../services/fileService');

const getFiles = async (req, res) => {
    try {
        const files = await fileService.getFiles(req.userId);
        res.status(200).json(files);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const createFile = async (req, res) => {
    try {
        // HTTP Validation
        if (!req.body.name || !req.body.type) {
            return res.status(400).json({ error: "Name and Type are required" });
        }

        const newItem = await fileService.createFile(req.userId, req.body);
        res.set('Location', `/api/files/${newItem.id}`);
        res.status(201).send();
    } catch (e) {
        const status = e.message.includes("Permission Denied") ? 403 : 400;
        res.status(status).json({ error: e.message });
    }
};

const getFileData = async (req, res) => {
    try {
        const file = await fileService.getFileData(req.params.id);
        if (!file) return res.status(404).json({ error: "File or Folder not found" });
        res.status(200).json(file);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        await fileService.deleteFile(req.params.id);
        res.status(204).send();
    } catch (e) {
        const status = e.message.includes("not found") ? 404 : 500;
        res.status(status).json({ error: e.message });
    }
};

const updateFile = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }
        const updated = await fileService.updateFile(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: "File or Folder not found" });
        res.status(204).send();
    } catch (e) {
        if (e.message.includes("Only files can have content")) {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: e.message });
    }
};

const searchFiles = async (req, res) => {
    try {
        if (!req.params.query) return res.status(400).json({ error: "Query is required" });
        const results = await fileService.searchFiles(req.userId, req.params.query);
        res.status(200).json(results);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    getFiles,
    createFile,
    getFileData,
    deleteFile,
    updateFile,
    searchFiles
};