const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);

// Manual seed trigger
router.post('/seed', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const { sampleProducts } = require('../../seeds/seedProducts');
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    return res.json({ success: true, message: `Successfully seeded ${sampleProducts.length} products` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
