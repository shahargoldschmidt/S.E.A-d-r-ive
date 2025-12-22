// In-memory storage for users
const usersStorage = new Map(); 

// Returns the raw user object by ID.
const getById = async (userId) => {
    return usersStorage.get(userId) || null;
};

// Finds a user by username
const getByUsername = async (username) => {
    for (const user of usersStorage.values()) {
        if (user.username === username) {
            return user;
        }
    }
    return null;
};

// The user have a email, and two users cant have the same email
const getByEmail = async (email) => {
    for (const user of usersStorage.values()) {
        if (user.email === email) {
            return user;
        }
    }
    return null;
};

//Data Creation: Responsible for building the User - Assigns ID and default values before saving
const createUser = async (userId, userData) => {
    const newUser = {
        id: userId,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name || "Anonymous",
        image: userData.image || "",
        createdAt: new Date().toISOString()
    };

    usersStorage.set(userId, newUser);
    return newUser;
};

module.exports = {
    getById,
    getByUsername,
    getByEmail,
    createUser 
};