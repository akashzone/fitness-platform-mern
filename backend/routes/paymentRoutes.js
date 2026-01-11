const express = require('express');
const router = express.Router();
const { handlePaymentSuccess } = require('../controllers/paymentController');

// This file formerly handled Razorpay. 
// New payment flow is in cashfreeRoutes.js
router.post('/success', handlePaymentSuccess);

module.exports = router;

module.exports = router;
