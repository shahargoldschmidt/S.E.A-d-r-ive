// routes/fileRoutes.js
const express = require('express');
const router = express.Router();

const validator = require('../security/userCheck');
const { requirePermission } = require('../security/permissionCheck');

// Controllers
const fileController = require('../Controllers/fileController');
const permissionController = require('../Controllers/permissionController');

// Security
router.use(validator);

// Route: /api/files
router.route('/')
    // List all files
    .get(fileController.getFiles)   
     // Create/Upload a new file
    .post(fileController.createFile);

// Route: /api/files/:id
router.route('/:id')
    // get specific file data
    .get(
        requirePermission('READ'),          
        fileController.getFileData
    )
    // update file
    .patch(
        requirePermission('WRITE'),        
        fileController.updateFile
    )
    // Delete file
    .delete(
        requirePermission('DELETE'),
        fileController.deleteFile
    );


// Nested Permissions Management

// Route: /api/files/:id/permissions
router.route('/:id/permissions')
    // List permissions for this file
    .get(
        requirePermission('MANAGE'),        
        permissionController.getPermissions
    )
    // Add permission to this file
    .post(
        requirePermission('MANAGE'),       
        permissionController.createPermission
    );

// Route: /api/files/:id/permissions/:pId
router.route('/:id/permissions/:pId')
    // Update specific permission
    .patch(
        requirePermission('MANAGE'),        
        permissionController.updatePermission
    )
    // Remove specific permission
    .delete(
        requirePermission('MANAGE'),       
        permissionController.deletePermission
    );

module.exports = router;