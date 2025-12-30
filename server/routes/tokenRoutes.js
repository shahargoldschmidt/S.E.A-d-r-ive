const express = require('express');
const router = express.Router();

const tokenController = require('../Controllers/tokenController');

// Token Routes User login POST /api/tokens
// Validates username and password and returns user ID 
router.post('/', tokenController.createToken);

module.exports = router;
