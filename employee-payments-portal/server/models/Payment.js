// server/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    recipient: { type: String, required: true },
    status: { type: String, default: 'pending' }, // e.g., pending, completed
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
