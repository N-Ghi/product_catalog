const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create category', error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({ categories });
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to fetch categories', error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }
        
        category.name = req.body.name || category.name;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to update category', error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};