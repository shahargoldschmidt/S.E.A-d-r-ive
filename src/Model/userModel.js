const { v4: uuidv4 } = require('uuid');

// In-Memory Storage
// Map<userId, UserObject>
const usersStorage = new Map(); 

//Public API

/**
 * Creates a new user and stores it in memory.
 * Throws an error if the username already exists.
 *
 * @param {Object} userData - User registration data
 * @returns {Object} User object without password
 */
const createUser = (userData) => {
    // Check if the username is already taken (internal logic)
    if (_isUsernameTaken(userData.username)) {
        throw new Error('Username already exists');
    }

    // Generate a unique user ID
    const newUserId = uuidv4();
    
    // Build the user object
    const newUser = {
        id: newUserId,
        username: userData.username,
        password: userData.password, // Stored in memory for this exercise (would be hashed in real systems)
        name: userData.name || "Anonymous",
        image: userData.image || "", // Optional field according to the assignment
        createdAt: new Date().toISOString()
    };

    // Persist user in in-memory storage
    _saveUser(newUserId, newUser);
    
    // Return user data without password (security best practice)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Retrieves user information by user ID.
 *
 * @param {string} userId
 * @returns {Object|null} User object without password or null if not found
 */
const getUserById = (userId) => {
    const user = _getUser(userId);
    if (!user) return null;

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * Validates login credentials (username and password).
 *
 * @param {string} username
 * @param {string} password
 * @returns {{id: string}|null} User ID if credentials are valid, otherwise null
 */
const validateLogin = (username, password) => {
    const user = _findUserByUsername(username);
    
    if (user && user.password === password) {
        return { id: user.id };
    }
    return null;
};

// ==========================================================
// Module Exports
// ==========================================================

module.exports = {
    createUser,
    getUserById,
    validateLogin
};

// ==========================================================
// 3. Helper Functions (Private / Internal)
// ==========================================================

/**
 * Saves a user object in the in-memory storage.
 */
function _saveUser(id, user) {
    usersStorage.set(id, user);
}

/**
 * Retrieves a user object by ID from storage.
 */
function _getUser(id) {
    return usersStorage.get(id);
}

/**
 * Finds a user by username.
 */
function _findUserByUsername(username) {
    for (const user of usersStorage.values()) {
        if (user.username === username) {
            return user;
        }
    }
    return null;
}

/**
 * Checks whether a username already exists.
 */
function _isUsernameTaken(username) {
    return _findUserByUsername(username) !== null;
}
