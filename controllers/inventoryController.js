const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const Category = require('../models/categoryModel');


exports.inventoryTracker = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const products = await Product.find({ owner: userId });
        
        // Get variants for the products
        const productIds = products.map(p => p._id);
        const variants = await Variant.find({ product_id: { $in: productIds } }).populate('product_id', 'name');
        
        // Calculate total number of items
        const totalItems = variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
        
        // Calculate items per variant with low stock flags
        const variantStock = variants.map(variant => ({
            variantId: variant._id,
            productId: variant.product_id,
            color: variant.color || 'N/A',
            size: variant.size || 'N/A',
            stock: variant.stock || 0,
            lowStock: (variant.stock || 0) <= 10
        }));
        
        const inventoryData = {
            totalItems,
            variants: variantStock
        };

        res.status(200).json(inventoryData);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};