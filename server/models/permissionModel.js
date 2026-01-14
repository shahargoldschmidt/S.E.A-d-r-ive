/* server/models/permissionModel.js */
const mongoose = require('mongoose');

// MongoDB Storage for Permissions
const permissionSchema = new mongoose.Schema({
    fileId: { type: String, required: true }, // יכול להיות גם ObjectId אם הקבצים במונגו
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['VIEWER', 'EDITOR', 'ADMIN'], required: true }
});

permissionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Permission = mongoose.model('Permission', permissionSchema);

//get all premision for a file
const getPermissions = async (fileId) => { 
    return await Permission.find({ fileId });
};

//create a premision and add to map
const createPermission = async (fileId, userId, type) => {
    const existing = await Permission.findOne({ fileId, userId });
    if (existing) {
        throw new Error("User already has permission for this file");
    }

    const newPermission = new Permission({
        fileId,
        userId,
        type
    });

    return await newPermission.save();
};

// Updates an existing permission level
const updatePermission = async (pId, newType) => { 
    if (!mongoose.Types.ObjectId.isValid(pId)) return null;
    return await Permission.findByIdAndUpdate(pId, { type: newType }, { new: true });
};

// remove specific premision
const deletePermission = async (pId) => { 
    if (!mongoose.Types.ObjectId.isValid(pId)) return false;
    const result = await Permission.findByIdAndDelete(pId);
    return !!result;
};

// remove all the permissions for a file 
const removeAllPermissionsForFile = async (fileId) => {
    await Permission.deleteMany({ fileId });
};

module.exports = {
    getPermissions, 
    createPermission, 
    updatePermission, 
    deletePermission, 
    removeAllPermissionsForFile 
};