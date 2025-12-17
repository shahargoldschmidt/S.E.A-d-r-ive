const userModel = require('../models/userModel');


// Token Controller
// Handles user authentication (login)

/**
 * Create a login token
 * Endpoint: POST /api/tokens
 *
 * Validates user credentials and returns the user ID
 * if authentication is successful.
 * (In this exercise, no real token is generated.)
 */
const createToken = (req, res) => {
    try {
        // Extract credentials from request body
        const { username, password } = req.body;

        // Basic validation: ensure required fields exist
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Validate credentials using the UserModel
        // validateLogin returns an object containing the user ID on success,
        // or null if authentication fails
        const result = userModel.validateLogin(username, password);

        if (result) {
            // Successful login:
            // return status 200 and the user ID as required by the assignment
            res.status(200).json(result);
        } else {
            // Authentication failed:
            // invalid username or password
            res.status(404).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createToken
};
