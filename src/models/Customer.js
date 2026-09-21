const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: true },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ta', 'hi'],
      default: 'en',
    },
    addresses: [addressSchema],
    totalOrdersPlaced: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
