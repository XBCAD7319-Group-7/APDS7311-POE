const Payment = require('../models/Payment'); // Ensure this line is included

// Create Payment
const createPayment = async (req, res) => {
    const { amount, currency, swiftCode, recipientAccountNumber } = req.body;

    // Log the user information
    console.log('User information:', req.user);

    // Validate input
    if (!amount || !currency || !swiftCode || !recipientAccountNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const formattedCurrency = currency.toUpperCase();

    try {
        const newPayment = new Payment({ 
            userId: req.user.id, // Changed to req.user.id
            amount: amountNumber, 
            currency: formattedCurrency, 
            swiftCode, 
            recipientAccountNumber 
        });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal Server Error: Could not create payment' });
    }
};


// Get Payments
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.userId }); // Filter payments by user
        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found' });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal Server Error: Could not fetch payments' });
    }
};

module.exports = { createPayment, getPayments };
