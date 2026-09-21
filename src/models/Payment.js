const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    orderCode: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'COD'],
      default: 'RAZORPAY',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    gatewayOrderId: {
      type: String,
      default: '',
    },
    gatewayPaymentLinkId: {
      type: String,
      default: '',
    },
    gatewayPaymentId: {
      type: String,
      default: '',
    },
    paymentLinkUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED'],
      default: 'CREATED',
      index: true,
    },
    rawWebhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
