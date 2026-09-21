const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const whatsappService = require('./whatsappService');
const strings = require('../locales/strings');

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Generate a unique, readable business order ID
 */
function generateOrderCode() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `EG-${dateStr}-${randomSuffix}`;
}

/**
 * Generate a Razorpay payment link for an order
 */
async function createPaymentLink(order, customerPhone, customerName) {
  if (!razorpayInstance) {
    // Development fallback if keys not configured
    const simulatedUrl = `https://rzp.io/i/mock_${order.orderId}`;
    return {
      id: `plink_mock_${Date.now()}`,
      short_url: simulatedUrl,
    };
  }

  const amountInPaise = Math.round(order.priceBreakup.finalAmount * 100);

  const payload = {
    amount: amountInPaise,
    currency: 'INR',
    accept_partial: false,
    reference_id: order.orderId,
    description: `T-Shirt Order #${order.orderId} at EG Retail Shop`,
    customer: {
      name: customerName,
      contact: customerPhone,
    },
    notify: {
      sms: true,
      email: false,
      whatsapp: false, // We notify directly via our bot
    },
    reminder_enable: true,
    callback_url: `${process.env.BASE_URL || 'https://egretail.com'}/payment-callback`,
    callback_method: 'get',
  };

  const paymentLink = await razorpayInstance.paymentLink.create(payload);
  return paymentLink;
}

/**
 * Verify Razorpay Webhook Signature
 */
function verifyRazorpaySignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true; // dev bypass if secret omitted

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Process Razorpay Webhook Event
 */
async function processPaymentWebhook(event, payload) {
  if (event === 'payment_link.paid' || event === 'order.paid') {
    const paymentEntity = payload.payment?.entity || payload.payment_link?.entity;
    const orderCode = payload.payment_link?.entity?.reference_id || payload.order?.entity?.receipt;

    if (!orderCode) {
      console.warn('Webhook received without orderCode/reference_id');
      return;
    }

    const order = await Order.findOne({ orderId: orderCode });
    if (!order) {
      console.error(`Order with ID ${orderCode} not found for webhook`);
      return;
    }

    // Record Payment
    const payment = await Payment.create({
      orderId: order._id,
      orderCode: order.orderId,
      customerPhone: order.customerPhone,
      gateway: 'RAZORPAY',
      amount: order.priceBreakup.finalAmount,
      currency: 'INR',
      gatewayPaymentId: paymentEntity?.id || '',
      gatewayPaymentLinkId: payload.payment_link?.entity?.id || '',
      status: 'CAPTURED',
      rawWebhookPayload: payload,
    });

    // Update Order Status
    order.paymentStatus = 'PAID';
    order.orderStatus = 'CONFIRMED';
    order.paymentDetails = payment._id;
    await order.save();

    // Increment Customer Total Orders
    await Customer.updateOne(
      { phone: order.customerPhone },
      { $inc: { totalOrdersPlaced: 1 } }
    );

    // Get Customer Language
    const customer = await Customer.findOne({ phone: order.customerPhone });
    const lang = customer?.preferredLanguage || 'en';
    const dict = strings[lang] || strings.en;

    const firstItem = order.items[0] || {};
    const confirmationText = dict.orderPaidConfirmed
      .replace('{orderId}', order.orderId)
      .replace('{productName}', firstItem.productName || 'T-Shirt')
      .replace('{size}', firstItem.size || '')
      .replace('{quantity}', firstItem.quantity || 1)
      .replace('{amount}', order.priceBreakup.finalAmount)
      .replace('{paymentId}', payment.gatewayPaymentId || 'PAID_ONLINE')
      .replace('{address}', `${order.deliveryAddress.street}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}`);

    // Send WhatsApp confirmation
    await whatsappService.sendTextMessage(order.customerPhone, confirmationText);
  }
}

module.exports = {
  generateOrderCode,
  createPaymentLink,
  verifyRazorpaySignature,
  processPaymentWebhook,
};
