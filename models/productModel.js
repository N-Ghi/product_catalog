const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
name: { type: String, required: true },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
description: String,
brand: String,
category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
status: { type: String, enum: ['in-stock', 'out-of-stock', 'low-stock'], default: 'in-stock' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
