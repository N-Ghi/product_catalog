const Product = require('../models/productModel');
const Variant = require('../models/variantModel');

// Helper function to process discount data (simplified - discountPrice is read-only)
const processDiscountData = (variantData) => {
    // Use the static method from the schema
    return Variant.processDiscountData(variantData);
};

// GET my products and their variants
exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $match: { owner: req.user._id } },
            {
                $lookup: {
                    from: 'variants',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'variants',
                }
            }
        ]);
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// POST a new product
exports.createProduct = async (req, res) => {
    let session;
    try {
        session = await Product.startSession();

        const { variants, ...productData } = req.body;

        let product, variantDocs;

        // Start transaction only if session supports it
        const isReplicaSet = session.client.topology.s.description.type === 'ReplicaSetWithPrimary';
        if (isReplicaSet) session.startTransaction();

        // 1. Create Product
        product = new Product(productData);
        product.owner = req.user._id;
        await product.save({ session: isReplicaSet ? session : null });

        // 2. Process and create Variants with discount calculations
        variantDocs = [];
        for (let variantData of variants) {
            try {
                const processedVariant = processDiscountData(variantData);
                variantDocs.push({
                    ...processedVariant,
                    product_id: product._id
                });
            } catch (discountError) {
                throw new Error(`Variant discount error: ${discountError.message}`);
            }
        }

        await Variant.insertMany(variantDocs, isReplicaSet ? { session } : {});

        if (isReplicaSet) {
            await session.commitTransaction();
            session.endSession();
        }

        res.status(201).json({ product, variants: variantDocs });
    } catch (err) {
        if (session && session.inTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(400).json({ error: err.message });
    }
};

// Update a product and variants by ID
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { variants, ...productData } = req.body;

        // Verify the product belongs to the user
        const existingProduct = await Product.findOne({_id: id, owner: req.user._id});

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Update the product data
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });

        // Handle variants update if provided
        if (variants && Array.isArray(variants)) {
            // Remove existing variants for this product
            await Variant.deleteMany({ product_id: id });

            // Process and add new variants with discount calculations
            const variantPromises = variants.map(variantData => {
                const processedVariant = processDiscountData(variantData);
                return new Variant({...processedVariant, product_id: id}).save();
            });

            await Promise.all(variantPromises);
        }

        // Fetch the updated product with variants
        const productWithVariants = await Product.aggregate([
            { $match: { _id: updatedProduct._id } },
            {
                $lookup: {
                    from: 'variants',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'variants',
                }
            }
        ]);

        res.status(200).json({message: 'Product updated successfully', product: productWithVariants[0]});

    } catch (err) {
        console.error('Error updating product:', err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({message: 'Validation error', errors });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update specific variant
exports.updateVariant = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        let variantData = req.body;

        // Remove discountPrice from request body if present (read-only field)
        if (variantData.discountPrice !== undefined) {
            delete variantData.discountPrice;
        }

        // Verify the product belongs to the user
        const product = await Product.findOne({_id: productId, owner: req.user._id});

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Process discount data (validation only, discountPrice calculated automatically)
        const processedVariant = processDiscountData({
            // We need current price if not updating it
            ...(await Variant.findById(variantId).select('price')).toObject(),
            ...variantData
        });

        // Update the variant (discountPrice will be calculated by middleware)
        const updatedVariant = await Variant.findOneAndUpdate(
            { _id: variantId, product_id: productId }, 
            processedVariant, 
            { new: true, runValidators: true }
        );

        if (!updatedVariant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        res.status(200).json({ 
            message: 'Variant updated successfully', 
            variant: {
                ...updatedVariant.toObject(),
                finalPrice: updatedVariant.getFinalPrice(),
                savings: updatedVariant.getDiscountAmount()
            }
        });

    } catch (err) {
        console.error('Error updating variant:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }

        res.status(400).json({ message: err.message });
    }
};

// Add new variant to existing product
exports.addVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        let variantData = req.body;

        // Remove discountPrice from request body if present (read-only field)
        if (variantData.discountPrice !== undefined) {
            delete variantData.discountPrice;
        }

        // Verify the product belongs to the user
        const product = await Product.findOne({ _id: productId, owner: req.user._id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Process discount data
        const processedVariant = processDiscountData(variantData);

        // Create new variant (discountPrice will be calculated by pre-save middleware)
        const newVariant = new Variant({ ...processedVariant, product_id: productId });

        await newVariant.save();

        res.status(201).json({ 
            message: 'Variant added successfully', 
            variant: {
                ...newVariant.toObject(),
                finalPrice: newVariant.getFinalPrice(),
                savings: newVariant.getDiscountAmount()
            }
        });

    } catch (err) {
        console.error('Error adding variant:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                message: 'Validation error', 
                errors 
            });
        }

        res.status(400).json({ message: err.message });
    }
};

// Delete variant
exports.deleteVariant = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        // Verify the product belongs to the user
        const product = await Product.findOne({ _id: productId, owner: req.user._id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Delete the variant
        const deletedVariant = await Variant.findOneAndDelete({ _id: variantId, product_id: productId });

        if (!deletedVariant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        res.status(200).json({ message: 'Variant deleted successfully', variant: deletedVariant });

    } catch (err) {
        console.error('Error deleting variant:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify the product belongs to the user
        const product = await Product.findOne({ _id: id, owner: req.user._id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Delete the product and its variants
        await Product.deleteOne({ _id: id });
        await Variant.deleteMany({ product_id: id });

        res.status(200).json({ message: 'Product and its variants deleted successfully' });

    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
