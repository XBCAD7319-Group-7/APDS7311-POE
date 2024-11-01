// /controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const login = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid username or password');
        }

        console.log('User found:', user.username); // Logging found user

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Plain Password:', password);
        console.log('Stored Hashed Password:', user.password);
        console.log('Password Match:', isMatch); // Logging match result

        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, token };
    } catch (error) {
        console.error('Login error:', error.message);
        throw error; // Rethrow or handle as needed
    }
};

module.exports = { login};
