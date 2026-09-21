require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

const sampleProducts = [
  // Half Sleeve
  {
    sku: 'TSHIRT-HALF-001',
    name: 'Classic Combed Half Sleeve',
    category: 'HALF_SLEEVE',
    description: '180 GSM 100% bio-washed combed cotton everyday crew neck.',
    basePrice: 499,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 50, M: 60, L: 80, XL: 40, XXL: 20 },
    isActive: true,
  },
  {
    sku: 'TSHIRT-HALF-002',
    name: 'Heather Grey Half Sleeve',
    category: 'HALF_SLEEVE',
    description: 'Soft melange blended half sleeve for maximum breathability.',
    basePrice: 529,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 30, M: 40, L: 50, XL: 30, XXL: 15 },
    isActive: true,
  },

  // Full Sleeve
  {
    sku: 'TSHIRT-FULL-001',
    name: 'Ribbed Cuff Full Sleeve',
    category: 'FULL_SLEEVE',
    description: '200 GSM double-stitched full sleeve with snug lycra cuffs.',
    basePrice: 599,
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 40, M: 50, L: 50, XL: 35, XXL: 15 },
    isActive: true,
  },

  // Drop Shoulder
  {
    sku: 'TSHIRT-DROP-001',
    name: 'Acid Wash Vintage Drop Shoulder',
    category: 'DROP_SHOULDER',
    description: '240 GSM heavy French terry oversized street fit.',
    basePrice: 699,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 35, M: 45, L: 60, XL: 30, XXL: 20 },
    isActive: true,
  },
  {
    sku: 'TSHIRT-DROP-002',
    name: 'Monochrome Oversized Tee',
    category: 'DROP_SHOULDER',
    description: 'Clean minimalist drop shoulder aesthetic with raw edge hem.',
    basePrice: 649,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 25, M: 35, L: 40, XL: 25, XXL: 10 },
    isActive: true,
  },

  // Regular Fit
  {
    sku: 'TSHIRT-REG-001',
    name: 'Timeless Navy Regular Fit',
    category: 'REGULAR_FIT',
    description: 'Pre-shrunk 190 GSM ring-spun cotton with reinforced seams.',
    basePrice: 449,
    imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 50, M: 60, L: 70, XL: 40, XXL: 25 },
    isActive: true,
  },

  // Loose Fit
  {
    sku: 'TSHIRT-LOOSE-001',
    name: 'Airy Pastel Loose Fit',
    category: 'LOOSE_FIT',
    description: 'Ultra-lightweight 210 GSM relaxed silhouette for summer days.',
    basePrice: 549,
    imageUrl: 'https://images.unsplash.com/photo-1618354691438-25bc04584c03?w=600',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 30, M: 45, L: 50, XL: 25, XXL: 15 },
    isActive: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/whatsapp_tshirt_store';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding...');

  await Product.deleteMany({});
  console.log('Cleared existing products.');

  await Product.insertMany(sampleProducts);
  console.log(`Successfully seeded ${sampleProducts.length} T-shirt products across 5 categories.`);

  await mongoose.disconnect();
  console.log('Database disconnected.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
