const express = require('express');
const Payment = require('../models/Payment'); // Adjust the path as necessary to match your project structure
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.userId; // Attach userId to request object
        next();
    });
};

// Validation Regex Patterns
const swiftCodeRegex = /^[A-Z]{6}[A-Z1-9]{2}([A-Z1-9]{3})?$/; // Basic regex for SWIFT/BIC code validation
const currencyRegex = /^[A-Z]{3}$/; // Regex for currency codes (e.g., USD, EUR)

// Create Payment with validation
router.post('/', authMiddleware, async (req, res) => {
    const { amount, currency, swiftCode, recipientAccountNumber } = req.body;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid or missing amount. Amount must be a positive number.' });
    }
    if (!currencyRegex.test(currency)) {
        return res.status(400).json({ message: 'Invalid currency format. Currency must be a three-letter code.' });
    }
    if (!swiftCodeRegex.test(swiftCode)) {
        return res.status(400).json({ message: 'Invalid SWIFT code format.' });
    }
    if (!recipientAccountNumber) {
        return res.status(400).json({ message: 'Recipient account number is required.' });
    }

    try {
        const newPayment = new Payment({
            userId: req.userId,
            amount,
            currency,
            swiftCode,
            recipientAccountNumber
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully' });
    } catch (err) {
        console.error('Error creating payment:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all Payments for a User
router.get('/', authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.userId });
        res.json(payments);
    } catch (error) {
        console.error('Error retrieving payments:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
