const crypto = require('crypto');

/**
 * Validates Meta X-Hub-Signature-256 header using WHATSAPP_APP_SECRET
 */
function verifyMetaSignature(req, res, next) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    // If secret not configured in dev, proceed
    return next();
  }

  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.warn('Missing X-Hub-Signature-256 header on incoming webhook');
    return res.status(401).send('Missing signature');
  }

  const elements = signature.split('sha256=');
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(req.rawBody || '')
    .digest('hex');

  if (signatureHash !== expectedHash) {
    console.error('Invalid X-Hub-Signature-256 signature mismatch');
    return res.status(403).send('Invalid signature');
  }

  next();
}

module.exports = {
  verifyMetaSignature,
};
