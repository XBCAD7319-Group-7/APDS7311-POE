const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    console.log('Received login request:', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        console.log('User found:', user);

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // If password matches, return success response with user data
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        // Enhanced error logging
        if (error instanceof mongoose.Error) {
            console.error('MongoDB error during login:', error);
            return res.status(500).json({ message: 'Database error', error: error.message });
        } else {
            console.error('Unexpected error during login:', error);
            return res.status(500).json({ message: 'Unexpected server error', error: error.message });
        }
    }
});

// Export the router
module.exports = router;
