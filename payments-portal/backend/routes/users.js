const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the path to your model is correct
const validator = require('validator'); // Import validator for enhanced sanitization

const router = express.Router();

// Regex for username validation: alphanumeric characters and underscores, 5-20 characters long
const usernameRegex = /^\w{5,20}$/; // Uses concise '\w' syntax

// Environment-based configurations
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Configurable salt rounds
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("JWT_SECRET is not set. Exiting.");
  process.exit(1);
}

// Register route with secure query handling
router.post('/register', async (req, res) => {
  let { username, password } = req.body;

  // Sanitize and validate the username
  username = validator.escape(username.trim());
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format. Only alphanumeric and underscores, 5-20 characters long.' });
  }

  try {
    // Parameterized query with fully sanitized username
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username: username, password: hashedPassword });
    await newUser.save();

    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

// Login route with secure query handling
router.post('/login', async (req, res) => {
  let { username, password } = req.body;

  // Sanitize and validate the username
  username = validator.escape(username.trim());
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format.' });
  }

  try {
    // Parameterized query with fully sanitized username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', username);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});

module.exports = router;
