const Category = require('../models/category');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');

exports.addCategory = async (req, res, next) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();

        const result = new Result('Add successfully', savedCategory);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        await Category.findOneAndUpdate({ _id: req.params.id, status: 'active' }, req.body);

        const result = new Result('Update successfully');
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Category not found', 'category_id', 'invalid', 'Invalid category_id');
        next(error);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        let category = await Category.findOne({ _id: req.params.id, status: 'active' });
        category.status = 'disabled';
        await category.save();

        const result = new Result('Delete successfully');
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Category not found', 'category_id', 'invalid', 'Invalid category_id');
        next(error);
    }
};