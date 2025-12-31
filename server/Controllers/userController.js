const userService = require('../services/userService');

// Helper function to validate email format using Regex
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
};

// Registers a new user via POST /api/users
const createUser = async (req, res) => {
    try {
        // Extract user data from request body (Username is NOT required from client)
       const { password, name, image, email } = req.body;

        // Validate mandatory fields
        if (!password || !email) {
            return res.status(400).json({ error: "Password and email are required" });
        }
        
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        
        if (!isValidPassword(password)) {
            return res.status(400).json({ 
                error: "Password must contain at least 8 characters, one uppercase letter, one number, and one special character (!@#$%^&*)" 
            });
        }

        // Logic Change: Generate username from the first part of the email
        // e.g., "john@gmail.com" -> "john"
        const generatedUsername = email.split('@')[0];

        // Create a new user via the service
        const newUser = await userService.createUser({ 
            username: generatedUsername, 
            password, 
            name, 
            image, 
            email 
        });
        
        res.status(201).json(newUser);

    } catch (error) {
        // Handle duplicate email error
        if (error.message === 'Email already exists') {
            return res.status(409).json({ error: error.message });
        }

        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
    }
};

// Retrieves user information via GET /api/users/:id
const getUser = async (req, res) => {
    try {
        // Use the ID from the URL if provided, otherwise use the ID from the token (req.userId)
        const userId = req.params.id || req.userId;
        
        const user = await userService.getUser(userId); 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getUser,
};