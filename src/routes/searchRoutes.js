const express = require('express');
const router = express.Router();

// Middleware - must be connected
const validator = require('../security/userCheck');

// the controller that will handel search .
const fileController = require('../Controllers/fileController');

// Security
router.use(validator);

// Route: GET /api/search/:query.
router.get('/:query', fileController.searchFiles);

module.exports = router;