const Payment = require('../models/Payment');

const createPayment = async (req, res) => {
    const { amount, currency, recipient } = req.body;

    // Simple input validation
    const amountPattern = /^[0-9]+(\.[0-9]{1,2})?$/; // Example regex for amount
    const currencyPattern = /^[A-Z]{3}$/; // 3-letter currency code
    const recipientPattern = /^[a-zA-Z0-9\s]+$/; // Alphanumeric names

    if (!amountPattern.test(amount) || !currencyPattern.test(currency) || !recipientPattern.test(recipient)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const newPayment = new Payment({ amount, currency, recipient });
    await newPayment.save();
    res.status(201).json(newPayment);
};

// Define the getPayments function
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find(); // Fetches all payments
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments' });
    }
};

module.exports = { createPayment, getPayments };
