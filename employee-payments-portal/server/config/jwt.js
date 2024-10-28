// server/config/jwt.js
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tadd'; // Use a strong secret
const JWT_EXPIRATION = '1h'; // Set expiration time

module.exports = { JWT_SECRET, JWT_EXPIRATION };
