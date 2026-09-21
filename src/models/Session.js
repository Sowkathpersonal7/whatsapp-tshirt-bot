const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: 'AWAITING_LANGUAGE',
      index: true,
    },
    language: {
      type: String,
      enum: ['en', 'ta', 'hi'],
      default: 'en',
    },
    cart: {
      category: { type: String, default: null },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
      productName: { type: String, default: '' },
      basePrice: { type: Number, default: 0 },
      size: { type: String, default: '' },
      quantity: { type: Number, default: 1 },
      customizationType: { type: String, default: 'NO_CUSTOMIZATION' },
      customizationDetails: { type: String, default: '' },
      customizationCharge: { type: Number, default: 0 },
      priceBreakup: {
        productsTotal: { type: Number, default: 0 },
        customizationTotal: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        shippingFee: { type: Number, default: 0 },
        finalAmount: { type: Number, default: 0 },
      },
    },
    customerDetails: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    pendingOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    lastInteractionAt: {
      type: Date,
      default: Date.now,
    },
    nudgeSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-expire sessions after 24 hours of inactivity
sessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Session', sessionSchema);
