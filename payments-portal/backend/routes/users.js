const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the path to your model is correct

const router = express.Router();

// Regex for username validation: alphanumeric characters and underscores, 5-20 characters long
const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate username
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format. Only alphanumeric and underscores, 5-20 characters long.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const saltRounds = 10; // Cost factor for hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'defaultSecretKey', // Ensure you have a robust secret key
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', username);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});

module.exports = router; //////
