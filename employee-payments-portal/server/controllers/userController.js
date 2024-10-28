const User = require('../models/User'); // Adjust the path as needed
const bcrypt = require('bcrypt');
const connectDB = require('../config/db'); // Adjust the path as needed

const createUser = async (username, plainPassword) => {
    try {
        await connectDB(); // Connect to MongoDB
        console.log("Database connection established.");

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return existingUser; // Exit if the user exists
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log('Hashed password:', hashedPassword);

        const newUser = new User({ username, password: hashedPassword, role: 'user' });
        console.log('New user object:', newUser);

        await newUser.save(); // Save the user to the database
        console.log('User created successfully:', newUser);
        return newUser; // Return the created user
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
};

const login = async (username, password) => {
    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return null; // Return null if the user doesn't exist
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password');
            return null; // Return null if password doesn't match
        }

        console.log('Login successful:', user);
        return user; // Return user object on successful login
    } catch (error) {
        console.error('Error during login:', error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
};

// Separate export statements
module.exports.createUser = createUser; 
module.exports.login = login;
