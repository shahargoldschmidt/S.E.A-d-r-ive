const userModel = require('../models/userModel');

// ==========================================================
// User Controller
// Handles user registration and user data retrieval
// ==========================================================

/**
 * Register a new user
 * Endpoint: POST /api/users
 *
 * Validates required fields and delegates user creation
 * to the UserModel.
 */
const register = (req, res) => {
    try {
        // Extract user data from request body
        const { username, password, name, image } = req.body;

        // Validate mandatory fields
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Create a new user via the model
        const newUser = userModel.createUser({ username, password, name, image });

        // Successfully created
        res.status(201).json(newUser);
    } catch (error) {
        // Handle duplicate username error
        if (error.message === 'Username already exists') {
            return res.status(409).json({ error: error.message });
        }

        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user information by user ID
 * Endpoint: GET /api/users/:id
 *
 * Returns user details (without password) if found.
 */
const getUser = (req, res) => {
    try {
        // Extract user ID from URL parameters
        const userId = req.params.id;

        // Retrieve user from the model
        const user = userModel.getUserById(userId);

        // User not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // User found
        res.status(200).json(user);
    } catch (error) {
        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
    }
};

// Note: Login functionality is intentionally handled
// in a separate TokenController (POST /api/tokens)

module.exports = {
    register,
    getUser
};
