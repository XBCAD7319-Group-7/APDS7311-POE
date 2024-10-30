const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await userController.login(username, password);
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            redirectUrl: '/payments', // Provide redirect URL
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: error.message }); // Return 401 for invalid login attempts
    }
});

// Export the router
module.exports = router;
