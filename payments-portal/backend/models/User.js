const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's new or has been modified
    if (!this.isModified('password')) return next();
    // Hash the password with a salt round of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET, // Use the secret from environment variables
    { expiresIn: '1h' } // Token expiration time
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
