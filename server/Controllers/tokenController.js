const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Use environment variable for the secret key, fallback to a dev key if not defined
const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret'; 

// User login via POST /api/tokens
const createToken = async (req, res) => {
    try {
        // Change: Extract email instead of username
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Validate credentials against the database
        const user = await userService.validateLogin(email, password);

        if (user) {
            // Successful login: Generate a JWT
            const token = jwt.sign(
                { id: user.id },    // Payload
                JWT_SECRET,         // Secret Key
                { expiresIn: '1h' } // Expiration
            );

            res.status(200).json({ token, userId: user.id });
        } else {
            // Authentication failed
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createToken
};