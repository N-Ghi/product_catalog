const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

router.get('/dashboard', protect, (req, res) => {
res.json({ message: `Welcome, ${req.user.username}` });
});

// Category Router
router.post('/categories', protect, categoryController.createCategory);
router.get('/categories', protect, categoryController.getAllCategories);
router.put('/categories/:id', protect, categoryController.updateCategory);
router.delete('/categories/:id', protect, categoryController.deleteCategory);
router.get('/categories/:id', protect, categoryController.getCategoryById);

// Product Router
router.get('/products/mine', protect, productController.getMyProducts);
router.post('/products', protect, productController.createProduct);
router.put('/products/:id', protect, productController.updateProduct);
router.put('/products/:productId/variants/:variantId', protect, productController.updateVariant);
router.post('/products/:productId/variants', protect, productController.addVariant);
router.delete('/products/:productId/variants/:variantId', protect, productController.deleteVariant);
router.delete('/products/:id', protect, productController.deleteProduct);

module.exports = router;
