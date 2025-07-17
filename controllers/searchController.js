const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const Category = require('../models/categoryModel');


exports.searchByName = async (req, res) => {
    const name = req.query.name;
    try {
        const products = await Product.find({ name: new RegExp(name, 'i') })
            .exec();

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Manually populate variants
        const productsWithVariants = await Promise.all(
            products.map(async (product) => {
                const variants = await Variant.find({ product_id: product._id });
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );

        res.status(200).json(productsWithVariants);
    }
    catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.searchByCategory = async (req, res) => {
    const categoryName = req.query.category;
    
    try {
        // Find categories that match the search term
        const categories = await Category.find({ name: new RegExp(categoryName, 'i') })
            .exec();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No category found' });
        }

        // Get all category IDs
        const categoryIds = categories.map(cat => cat._id);

        // Find products in these categories
        const products = await Product.find({ category_id: { $in: categoryIds } })
            .exec();

        // Add variants to each product
        const productsWithVariants = await Promise.all(
            products.map(async (product) => {
                const variants = await Variant.find({ product_id: product._id });
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );

        res.status(200).json(productsWithVariants);
    }
    catch (err) {
        console.error('Error searching category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.searchByDateCreated = async (req, res) => {
    const order = req.query.order;
    let products;
    try {
        if (order !== 'oldest' && order !== 'newest') {
            return res.status(400).json({ message: 'Invalid order parameter. Use "oldest" or "newest".' });
        }
        if (order === 'newest') {
            products = await Product.find()
                .sort({ createdAt: -1 })
                .exec();
        }
        else {
            products = await Product.find()
                .sort({ createdAt: 1 })
                .exec();
        }

        // Add variants to each product
        const productsWithVariants = await Promise.all(
            products.map(async (product) => {
                const variants = await Variant.find({ product_id: product._id });
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );

        res.status(200).json(productsWithVariants);
    }
    catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.searchBySize = async (req, res) => {
    const size = req.query.size;
    try {
        // Find variants that match the search term
        const variants = await Variant.find({ size: new RegExp(size, 'i') })
            .exec();

        if (!variants || variants.length === 0) {
            return res.status(404).json({ message: 'No variants found' });
        }

        // Get all product IDs from the variants
        const productIds = variants.map(variant => variant.product_id);

        // Find products that match these IDs
        const products = await Product.find({ _id: { $in: productIds } })
            .exec();

        // Combine products with their variants
        const productsWithVariants = products.map(product => {
            return {
                ...product.toObject(),
                variants: variants.filter(v => v.product_id.toString() === product._id.toString())
            };
        });

        res.status(200).json(productsWithVariants);
    }
    catch (err) {
        console.error('Error searching variants:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.searchByColor = async (req, res) => {
    const color = req.query.color;
    try {
        // Find variants that match the search term
        const variants = await Variant.find({ color: new RegExp(color, 'i') })
            .exec();

        if (!variants || variants.length === 0) {
            return res.status(404).json({ message: 'No variants found' });
        }

        // Get all product IDs from the variants
        const productIds = variants.map(variant => variant.product_id);

        // Find products that match these IDs
        const products = await Product.find({ _id: { $in: productIds } })
            .exec();

        // Combine products with their variants
        const productsWithVariants = products.map(product => {
            return {
                ...product.toObject(),
                variants: variants.filter(v => v.product_id.toString() === product._id.toString())
            };
        });

        res.status(200).json(productsWithVariants);
    }
    catch (err) {
        console.error('Error searching variants:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};