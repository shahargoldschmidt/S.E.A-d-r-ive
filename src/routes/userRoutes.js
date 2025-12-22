const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userController');

// User Routes
// Base path: /api/user
/**
 * Register a new user
 * POST /api/users
 */
router.post('/', userController.register);

/**
 * Get user information by ID
 * GET /api/users/:id
 */
router.get('/:id', userController.getUser);

module.exports = router;
