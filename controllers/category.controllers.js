const Category = require('../models/category');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');

exports.listCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ status: 'active' });

        if (categories.length > 0) {
            const result = new Result('Successful', categories);
            res.status(200).send(result);
        } else {
            throw new NotFound('Category not found');
        }
    } catch (error) {
        next(error);
    }
}

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, status: 'active' });

        const result = new Result('Successful', category);
        res.status(200).send(result);
    } catch (error) {
        error = new NotFound('Category not found', 'category_id', 'invalid', 'Invalid category_id');
        next(error);
    }
};