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
}, { timestamps: true });

module.exports = mongoose.model('Variant', variantSchema);