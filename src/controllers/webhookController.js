const stateMachineService = require('../services/stateMachineService');
const whatsappService = require('../services/whatsappService');

/**
 * WhatsApp Webhook Verification (GET /webhook)
 * Verifies with Meta using verify_token
 */
function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('WhatsApp Webhook Verified Successfully!');
      return res.status(200).send(challenge);
    }
    console.error('WhatsApp Webhook Verification Failed: Token mismatch');
    return res.sendStatus(403);
  }

  return res.sendStatus(400);
}

/**
 * WhatsApp Webhook Event Handler (POST /webhook)
 * Receives incoming messages and status receipts
 */
async function handleWebhook(req, res) {
  // Always return 200 OK immediately to Meta to prevent timeout & retries
  res.status(200).send('EVENT_RECEIVED');

  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return;
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value || !value.messages || value.messages.length === 0) {
      // Could be message delivery status update (sent/delivered/read)
      return;
    }

    const message = value.messages[0];
    const from = message.from; // Customer phone number with country code

    // Mark as read in background
    whatsappService.markMessageAsRead(message.id);

    // Route message to conversation state machine
    await stateMachineService.processIncomingMessage(from, message);
  } catch (error) {
    console.error('Error in Webhook Handler:', error);
  }
}

module.exports = {
  verifyWebhook,
  handleWebhook,
};
