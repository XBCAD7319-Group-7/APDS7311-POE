// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Make sure req.user contains userId or other necessary data
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


module.exports = { checkAuth };
