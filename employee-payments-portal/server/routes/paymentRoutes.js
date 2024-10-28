// server/routes/paymentRoutes.js
const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createPayment);
router.get('/', auth, getPayments);

module.exports = router;
