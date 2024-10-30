require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Connect to MongoDB
const userController = require('./controllers/userController'); // Import userController with login logic

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from your frontend
app.use(express.json()); // Parse JSON request bodies

// Connect to the database
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Login Route (POST)
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    // Log the incoming login attempt
    console.log(`Login attempt for username: ${username}`);

    if (!username || !password) {
        console.warn('Login attempt without username or password');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const { user, token } = await userController.login(username, password); // Call login method from userController

        // Log successful login
        console.log(`User ${username} logged in successfully`);

        res.json({
            message: 'Login successful',
            token, // Send token for authenticated sessions
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(`Login failed for username: ${username}. Error: ${error.message}`);
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Listening for incoming requests...');
});

// Optional: Logging middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${new Date().toISOString()}`);
    next();
});
