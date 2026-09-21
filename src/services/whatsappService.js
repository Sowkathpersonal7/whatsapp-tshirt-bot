const axios = require('axios');

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v20.0'}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

/**
 * Sends a generic WhatsApp Graph API request
 */
async function sendRawMessage(payload) {
  try {
    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Send standard plain text message
 */
async function sendTextMessage(to, text) {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: true, body: text },
  };
  return sendRawMessage(payload);
}

/**
 * Send image message with optional caption
 * @param {string} to - Recipient phone number
 * @param {string} imageUrl - Publicly accessible image URL
 * @param {string} [captionText] - Optional caption text
 */
async function sendImageMessage(to, imageUrl, captionText = null) {
  const imageObj = { link: imageUrl };
  if (captionText) {
    imageObj.caption = captionText;
  }
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: imageObj,
  };
  return sendRawMessage(payload);
}

/**
 * Send Interactive Reply Buttons (Up to 3 buttons)
 * @param {string} to - Recipient phone number
 * @param {string} bodyText - Message body
 * @param {Array<{id: string, title: string}>} buttons - Array of buttons (max 3, title <= 20 chars)
 * @param {string} [headerText] - Optional header
 * @param {string} [footerText] - Optional footer
 */
async function sendQuickReplyButtons(to, bodyText, buttons, headerText = null, footerText = null) {
  const interactivePayload = {
    type: 'button',
    body: { text: bodyText },
    action: {
      buttons: buttons.slice(0, 3).map((btn) => ({
        type: 'reply',
        reply: {
          id: btn.id,
          title: btn.title.substring(0, 20),
        },
      })),
    },
  };

  if (headerText) {
    interactivePayload.header = { type: 'text', text: headerText };
  }
  if (footerText) {
    interactivePayload.footer = { text: footerText };
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: interactivePayload,
  };

  return sendRawMessage(payload);
}

/**
 * Send Interactive List Message (Up to 10 rows per section)
 * @param {string} to - Recipient phone number
 * @param {string} headerText - Header title
 * @param {string} bodyText - Body description
 * @param {string} buttonText - List button label (<= 20 chars)
 * @param {Array<{title: string, rows: Array<{id: string, title: string, description: string}>}>} sections
 * @param {string} [footerText] - Optional footer
 */
async function sendListMessage(to, headerText, bodyText, buttonText, sections, footerText = null) {
  const interactivePayload = {
    type: 'list',
    header: { type: 'text', text: headerText },
    body: { text: bodyText },
    action: {
      button: buttonText.substring(0, 20),
      sections,
    },
  };

  if (footerText) {
    interactivePayload.footer = { text: footerText };
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: interactivePayload,
  };

  return sendRawMessage(payload);
}

/**
 * Send Interactive CTA URL Button (Useful for instant payment link clicks)
 */
async function sendCtaUrlButton(to, headerText, bodyText, buttonText, url, footerText = null) {
  const interactivePayload = {
    type: 'cta_url',
    header: { type: 'text', text: headerText },
    body: { text: bodyText },
    action: {
      name: 'cta_url',
      parameters: {
        display_text: buttonText.substring(0, 20),
        url,
      },
    },
  };

  if (footerText) {
    interactivePayload.footer = { text: footerText };
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: interactivePayload,
  };

  return sendRawMessage(payload);
}

/**
 * Mark an incoming message as read
 */
async function markMessageAsRead(messageId) {
  try {
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };
    return sendRawMessage(payload);
  } catch (error) {
    // Log and continue, do not block main flow if read receipt fails
    console.warn(`Could not mark message ${messageId} as read:`, error.message);
  }
}

module.exports = {
  sendTextMessage,
  sendImageMessage,
  sendQuickReplyButtons,
  sendListMessage,
  sendCtaUrlButton,
  markMessageAsRead,
};
