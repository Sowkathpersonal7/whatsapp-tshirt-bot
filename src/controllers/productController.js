const Product = require('../models/Product');

/**
 * Get all products or filter by category
 */
async function getProducts(req, res) {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category.toUpperCase();

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get single product by ID
 */
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create a new product (Admin)
 */
async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
