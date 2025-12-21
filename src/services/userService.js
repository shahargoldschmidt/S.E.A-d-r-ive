const userModel = require('../models/userModel');
const crypto = require('crypto'); 

 // generates a unique ID using crypto, 
 //and instructs the model to create the record

const createUser = async (userData) => {
    // Ensure the username is unique before proceeding 
    const existingUser = await userModel.getByUsername(userData.username);
    if (existingUser) {
        throw new Error('Username already exists');
    }


    const userId = crypto.randomUUID();
    
    // Delegate the object building and persistence to the Model 
    const newUser = await userModel.createUser(userId, userData);
    
    //  Redact the password from the return object 
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

 //Fetches a user by ID and prepares data for the controller
const getUser = async (userId) => {
    const user = await userModel.getById(userId);
    if (!user) return null;

    // Redact the password before returning user metadata
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Validates login credentials against stored data
const validateLogin = async (username, password) => {
    const user = await userModel.getByUsername(username);
    
    // Validate plain-text password for this assignment phase 
    if (user && user.password === password) {
        // Return only the user ID upon successful authentication 
        return { id: user.id };
    }
    return null;
};

module.exports = {
    createUser,
    getUser,
    validateLogin
};