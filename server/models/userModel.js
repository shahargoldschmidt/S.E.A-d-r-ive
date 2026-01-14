/* server/models/userModel.js */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, default: "Anonymous" },
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
}); 

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const User = mongoose.model('User', userSchema);

// Returns the raw user object by ID.
const getById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;
    return await User.findById(userId);
};


// The user have a email, and two users cant have the same email
const getByEmail = async (email) => {
    return await User.findOne({ email });
};

//Data Creation: Responsible for building the User - Assigns ID and default values before saving
const createUser = async (userId, userData) => {
    const newUser = new User({
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name || "Anonymous",
        image: userData.image || ""
    });

    return await newUser.save();
};

module.exports = {
    getById,
    getByEmail,
    createUser 
};