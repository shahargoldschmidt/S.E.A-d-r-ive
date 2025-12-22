const userModel = require('../models/userModel');


// User login via POST /api/tokens
const createToken = async (req, res) => {
    try {
        // Extract credentials from request body
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const result = await userService.validateLogin(username, password);

        if (result) {
            // Successful login:
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
