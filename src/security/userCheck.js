// const userModel = require('../models/userModel'); // <-- Uncomment this after merging

const validator = (req, res, next) => {
    const userId = req.headers['user-id'];

    console.log(`[Validator] Checking access for User ID: ${userId}`);

    // Technical Check
    if (!userId) {
        return res.status(401).json({ 
            error: "Validation failed. Missing 'user-id' header." 
        });
    }

    // Check Does the user exist in the system
    const user = userModel.findById(userId);
    if (!user) {
         return res.status(401).json({ error: "Access Denied. User not found." });
    }

    // Validation passed
    req.userId = userId;
    next();
};



module.exports = validator;