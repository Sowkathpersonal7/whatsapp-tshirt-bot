const { verifyRazorpaySignature, processPaymentWebhook } = require('../services/paymentService');

/**
 * Handle incoming Razorpay Webhook notifications
 */
async function handleRazorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const isValid = verifyRazorpaySignature(rawBody, signature);
  if (!isValid) {
    console.error('Invalid Razorpay Webhook Signature');
    return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }

  const { event, payload } = req.body;

  try {
    await processPaymentWebhook(event, payload);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Razorpay webhook event:', error);
    return res.status(500).json({ status: 'error', error: error.message });
  }
}

module.exports = {
  handleRazorpayWebhook,
};
