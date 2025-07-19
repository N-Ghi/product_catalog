const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    status: { 
        type: String, 
        enum: ['in_stock', 'out_of_stock', 'low_stock'], 
        default: 'in_stock' 
    },
    isDiscounted: { type: Boolean, default: false },
    discountPrice: { 
        type: Number, 
        min: 0, 
        default: 0,
    },
    discount: { 
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0,
        validate: {
            validator: function(value) {
                // If discounted, discount percentage must be > 0
                if (this.isDiscounted && value <= 0) {
                    return false;
                }
                return true;
            },
            message: 'Discount percentage must be greater than 0 when item is discounted'
        }
    },
}, { timestamps: true });


// Pre-save middleware for discount calculations and validations
variantSchema.pre('save', function(next) {
    // Auto-update stock status
    if (this.stock === 0) {
        this.status = 'out_of_stock';
    } else if (this.stock <= 10) {
        this.status = 'low_stock';
    } else {
        this.status = 'in_stock';
    }

    // Handle discount calculations
    if (this.isDiscounted) {
        // Validate discount percentage is provided
        if (!this.discount || this.discount <= 0) {
            return next(new Error('Discount percentage is required when item is discounted'));
        }

        // Calculate discountPrice from discount percentage
        this.$__.skipDiscountPriceValidation = true;
        this.discountPrice = Math.round((this.price - (this.price * (this.discount / 100))) * 100) / 100;
        
        // Additional validation: ensure calculated price is positive
        if (this.discountPrice <= 0) {
            return next(new Error('Discount percentage too high - results in invalid price'));
        }
    } else {
        // If not discounted, reset discount fields
        this.$__.skipDiscountPriceValidation = true;
        this.discount = 0;
        this.discountPrice = 0;
    }

    next();
});

// Pre-update middleware for findOneAndUpdate operations
variantSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function(next) {
    const update = this.getUpdate();
    
    // Remove discountPrice from update if it exists (read-only field)
    if (update.discountPrice !== undefined) {
        delete update.discountPrice;
        delete update.$set?.discountPrice;
    }
    
    // If discount-related fields are being updated, we need to recalculate discountPrice
    if (update.isDiscounted !== undefined || update.discount !== undefined || update.price !== undefined) {
        try {
            // Get the current document
            const currentDoc = await this.model.findOne(this.getQuery());
            if (!currentDoc) {
                return next(new Error('Document not found'));
            }

            // Merge current values with updates
            const mergedData = {
                price: update.price !== undefined ? update.price : currentDoc.price,
                discount: update.discount !== undefined ? update.discount : currentDoc.discount,
                isDiscounted: update.isDiscounted !== undefined ? update.isDiscounted : currentDoc.isDiscounted
            };

            // Calculate new discountPrice
            if (mergedData.isDiscounted) {
                if (!mergedData.discount || mergedData.discount <= 0) {
                    return next(new Error('Discount percentage is required when item is discounted'));
                }
                
                const newDiscountPrice = Math.round((mergedData.price - (mergedData.price * (mergedData.discount / 100))) * 100) / 100;
                
                if (newDiscountPrice <= 0) {
                    return next(new Error('Discount percentage too high - results in invalid price'));
                }
                
                // Add calculated discountPrice to update
                if (!update.$set) update.$set = {};
                update.$set.discountPrice = newDiscountPrice;
            } else {
                // Reset discount fields if not discounted
                if (!update.$set) update.$set = {};
                update.$set.discount = 0;
                update.$set.discountPrice = 0;
            }
        } catch (error) {
            return next(error);
        }
    }
    
    next();
});

// Instance method to calculate final price
variantSchema.methods.getFinalPrice = function() {
    return this.isDiscounted && this.discountPrice > 0 ? this.discountPrice : this.price;
};

// Instance method to get discount amount
variantSchema.methods.getDiscountAmount = function() {
    return this.isDiscounted ? this.price - this.discountPrice : 0;
};

// Static method to validate and process discount data
variantSchema.statics.processDiscountData = function(variantData) {
    const { price, discount, isDiscounted, discountPrice, ...otherFields } = variantData;
    
    // Remove discountPrice from input data (read-only)
    const processedData = { price, discount, isDiscounted, ...otherFields };

    if (!isDiscounted) {
        processedData.discount = 0;
        // discountPrice will be set to 0 by pre-save middleware
        return processedData;
    }

    // Validate required discount percentage
    if (!discount || discount <= 0) {
        throw new Error('Discount percentage is required and must be greater than 0 when item is discounted');
    }

    if (discount > 100) {
        throw new Error('Discount percentage cannot exceed 100%');
    }

    // Validate that discount doesn't result in negative price
    const calculatedDiscountPrice = price - (price * (discount / 100));
    if (calculatedDiscountPrice <= 0) {
        throw new Error('Discount percentage too high - results in invalid price');
    }

    processedData.discountPrice = calculatedDiscountPrice;

    return processedData;
};

module.exports = mongoose.model('Variant', variantSchema);