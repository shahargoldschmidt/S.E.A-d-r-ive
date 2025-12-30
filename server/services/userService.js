const userModel = require('../models/userModel');
const crypto = require('crypto'); 

// Generates a unique ID and coordinates user creation
const createUser = async (userData) => { 
    // Multiple users can have the username "john" if their emails are different.

    // Ensure the email is unique before proceeding
    const existingEmail = await userModel.getByEmail(userData.email);
    if (existingEmail) {
        throw new Error('Email already exists'); 
    }

    const userId = crypto.randomUUID();
    
    // Delegate persistence to the Model 
    const newUser = await userModel.createUser(userId, userData);
    
    // Redact the password from the returned object 
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// Fetches a user by ID and prepares data for the controller
const getUser = async (userId) => {
    const user = await userModel.getById(userId);
    if (!user) return null;

    // Redact the password before returning user metadata
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Validates login credentials against stored data
const validateLogin = async (email, password) => {
    // Logic Change: Find user by Email instead of Username
    const user = await userModel.getByEmail(email);
    
    // Validate password (plain-text for now, bcrypt recommended for production)
    if (user && user.password === password) {
        return user;
    }
    return null;
};

module.exports = {
    createUser,
    getUser,
    validateLogin
};