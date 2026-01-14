/* server/models/fileModel.js */
const tcpClient = require('../services/tcpClientService');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    owner: { type: String, required: true }, // נשמור את המייל או ה-ID של הבעלים
    name: { type: String, required: true },
    type: { type: String, required: true }, // 'file', 'folder', 'image'
    parentId: { type: String, default: null },
    size: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

fileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const File = mongoose.model('File', fileSchema);

// Retrieves all metadata objects from DB
const getFiles = async () => {
    return await File.find({});
};

// Retrieves a single metadata object if exists
const getById = async (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) return null;
    return await File.findById(fileId);
};

// create file/folder and add to metadata. 
const create = async (email, fileId, fileData) => {
    const isFile = fileData.type === 'file' || fileData.type === 'image';
    
    // --- התיקון: שיניתי ל-let כדי שלא תהיה שגיאה ---
    let content = fileData.content || "";
    const isImage = fileData.type === 'image';

    if (isImage && content) {
        content = content.replace(/[\n\r]/g, '');
    }

    const newFile = new File({
        owner: email,
        name: fileData.name,
        type: fileData.type,
        parentId: fileData.parentId || null,
        size: isFile ? content.length : 0,
        createdAt: new Date().toISOString()
    });

    const generatedId = newFile._id.toString();


    // add to tcp if its a file
    if (isFile) {
        const command = `post ${fileId} ${content}`;
        const response = await tcpClient.sendCommand(command);
        if (!response.includes("201")) {
            throw new Error(`TCP Storage Error: ${response}`);
        }
    }
    //add to metadata
    await newFile.save();
    return newFile;
};

// Updates metadata for name and TCP for content.
const update = async (fileId, updates) => {
    const file = await File.findById(fileId);
    if (!file) return null;

    // if there is a change in the content 
    if (updates.content !== undefined) {
        
        // הוספתי את הניקוי גם כאן ליתר ביטחון (לא זורק שגיאה כי זה שדה באובייקט)
        const isImage = file.type === 'image';
        if (isImage) {
            updates.content = updates.content.replace(/[\n\r]/g, '');
        }
        
        // Get the current content from the C++ storage before making any changes
        const oldContent = await getTcpContent(fileId);

        try {
            // Delete the existing file from the C++ storage server
            await tcpClient.sendCommand(`delete ${fileId}`);

            // Attempt to upload the new content
            const response = await tcpClient.sendCommand(`post ${fileId} ${updates.content}`);

            // Verify if the C++ server returned a "201 Created" success code
            if (!response.includes("201")) {
                throw new Error(`TCP Error: ${response}`);
            }

            // Success: Update local metadata like file size
            updates.size = updates.content.length;
            // Remove content from the updates object so it is not saved in the metadata Map
            delete updates.content;

        } catch (e) {
            //ROLLBACK: If the new upload fails, try to restore the original data
            console.error(`[Rollback] Update failed, restoring old content: ${e.message}`);

            // Send the original content back to the C++ server
            await tcpClient.sendCommand(`post ${fileId} ${oldContent}`);

            // Throw an error so the Controller can notify the user that the update failed
            throw new Error(`Critical: Content update failed. Old content was restored.`);
        }
    }

   // Update the metadata in Mongo
    const updatedFile = await File.findByIdAndUpdate(fileId, updates, { new: true });
    return updatedFile;
};

// Deletes from Map and TCP.
const deleteFile = async (id) => {
    const meta = await File.findById(id);
    if (!meta) return false;
    //if its a file delte also from TCP
    if (meta.type === 'file' || meta.type === 'image') {
        await tcpClient.sendCommand(`delete ${id}`);
    }

    await File.findByIdAndDelete(id);
    return true;
};

// Fetches matching IDs from the C++ Server. 
const searchTcp = async (query) => {
    try {
        const response = await tcpClient.sendCommand(`search ${query}`);
        if (response.startsWith("200 Ok")) {
            const rawBody = response.split("\n\n")[1] || "";
            const ids = rawBody.trim().split(" ").filter(id => id !== "");

            const files = await File.find({ _id: { $in: ids } });
            return files;
        }
    } catch (e) {
        console.warn(`[FileModel] TCP Search connection warning: ${e.message}`);
    }
    return [];
};

// Fetches content for a specific file from TCP.
const getTcpContent = async (fileId) => {
    const response = await tcpClient.sendCommand(`get ${fileId}`);
    if (response.startsWith("200 Ok")) {
        return response.split("\n\n")[1] || "";
    }
    return "(Content not found on storage server)";
};

module.exports = {
    getFiles,
    getById,
    create,
    update,
    deleteFile,
    searchTcp,
    getTcpContent
};