console.log("Starting the createUser script...");

require('dotenv').config();
console.log("Environment variables loaded.");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Make sure this path is correct
const connectDB = require('./config/db');

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
    } finally {
        await mongoose.connection.close(); // Ensure the connection closes
        console.log('Database connection closed');
    }
};


createUser().catch(console.error);
