const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { verifyMetaSignature } = require('../middlewares/verifySignature');

// Meta Webhook Verification
router.get('/', webhookController.verifyWebhook);

// Meta Webhook Event Notification (with HMAC SHA-256 verification)
router.post('/', verifyMetaSignature, webhookController.handleWebhook);

module.exports = router;
