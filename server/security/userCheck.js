const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Must match the secret used in tokenController
const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret'; 

const validator = async (req, res, next) => {
    // Extract the token from the Authorization header (Format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the part after "Bearer"

    console.log(`[Validator] Checking access...`);

    // Check if token exists
    if (!token) {
        return res.status(401).json({ 
            error: "Access Denied. No token provided." 
        });
    }

    try {
        // Verify the token signature
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if the user still exists in the system
        const user = await userModel.getById(decoded.id);
        if (!user) {
             return res.status(401).json({ error: "Access Denied. User not found." });
        }

        // Validation passed: Attach user ID to the request object
        req.userId = decoded.id;
        next();

    } catch (error) {
        // Handle invalid or expired tokens
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = validator;