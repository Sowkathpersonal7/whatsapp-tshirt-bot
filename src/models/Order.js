const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    size: {
      type: String,
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    basePrice: { type: Number, required: true },
    customization: {
      type: {
        type: String,
        enum: [
          'NO_CUSTOMIZATION',
          'CUSTOM_TEXT_PRINT',
          'LOGO_PRINT',
          'COLOR_CHANGE',
        ],
        default: 'NO_CUSTOMIZATION',
      },
      details: { type: String, default: '' },
      chargePerUnit: { type: Number, default: 0 },
    },
    itemSubtotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerPhone: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, required: true },
    },
    items: [orderItemSchema],
    priceBreakup: {
      productsTotal: { type: Number, required: true },
      customizationTotal: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      shippingFee: { type: Number, default: 0 },
      finalAmount: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'ONLINE'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'PLACED',
        'CONFIRMED',
        'IN_PRODUCTION',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PLACED',
      index: true,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
