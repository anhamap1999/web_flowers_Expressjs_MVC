const Category = require('../models/category');

exports.addCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const result = await category.save();
        res.status(201).json({ category: result });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const result = await Category.findOneAndUpdate({ _id: req.params.id, status: 'active' }, req.body);
        res.status(200).json({ category: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findOne({ _id: req.params.id, status: 'active' });
        category.status = 'disabled';
        const result = await category.save();
        res.status(200).json({ category: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};