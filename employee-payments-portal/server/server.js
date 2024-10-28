require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Adjust the path as needed

// Import the user controller
const userController = require('./controllers/userController'); // Import the entire module

const app = express();
app.use(express.json()); // To parse JSON requests

// Connect to the database
connectDB();

// Create a new user
app.post('/api/users/create', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await userController.createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login Route
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await userController.login(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' }); // Use 401 for unauthorized
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
