const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { createPayment, getPayments } = require('../controllers/paymentController'); // Ensure these are correct
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Define routes with appropriate callback functions
router.get('/', checkAuth, getPayments);
router.post(
    '/',
    checkAuth,
    [
        check('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
        check('currency').isLength(3).withMessage('Invalid currency format'),
        check('swiftCode').isLength({ min: 8, max: 11 }).withMessage('Invalid SWIFT code')
    ],
    createPayment // Ensure this function is used correctly here
);

module.exports = router;
