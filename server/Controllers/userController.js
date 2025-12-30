const userService = require('../services/userService');


// Helper function to validate email format using Regex

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const hasSpaces = (str) => {
    return /\s/.test(str); 
};

// Registers a new user via POST /api/users
const createUser = async (req, res) => {
    try {
        // Extract user data from request body
       const { username, password, name, image, email } = req.body;

        // Validate mandatory fields
        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, password and email are required" });
        }

        if (hasSpaces(username)) {
            return res.status(400).json({ error: "Username cannot contain spaces" });
        }
        
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email format (e.g., user@example.com)" });
        }

        // Create a new user via the service
        const newUser = await userService.createUser({ username, password, name, image, email });
        res.status(201).json(newUser);

    } catch (error) {
        // Handle duplicate username error
        if (error.message === 'Username already exists' || error.message === 'Email already exists') {
            return res.status(409).json({ error: error.message });
        }

        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
    }
};

//Retrieves user information via GET /api/users/:id
const getUser = async (req, res) => {
    try {
        // Extract user ID from URL parameters
        const userId = req.params.id;
        const user = await userService.getUser(userId); 

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

module.exports = {
    createUser,
    getUser,
};