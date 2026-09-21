const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/razorpay/webhook', paymentController.handleRazorpayWebhook);

module.exports = router;
