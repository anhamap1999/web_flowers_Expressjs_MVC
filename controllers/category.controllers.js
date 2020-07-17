const Category = require('../models/category');

exports.listCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: 'active' });
        res.status(200).json({ categories: categories });
    } catch (error) {
        res.status(404).json({ message: 'Category not found!' });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, status: 'active' });
        res.status(200).json({ category: category });
    } catch (error) {
        res.status(404).json({ message: 'Category not found!' });
    }
};