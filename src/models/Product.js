const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'HALF_SLEEVE',
        'FULL_SLEEVE',
        'DROP_SHOULDER',
        'REGULAR_FIT',
        'LOOSE_FIT',
      ],
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    availableSizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    stock: {
      type: Map,
      of: Number,
      default: { S: 50, M: 50, L: 50, XL: 50, XXL: 50 },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
