const Category = require('../models/category');
const Joi = require('joi');
const { BadRequest } = require('../utils/error');

exports.categoryValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        category_name: Joi.string().max(50).required()
    });
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            const errors = err.details.map(error => {
                return {
                    key: error.context.key,
                    value: 'invalid',
                    message: error.message
                };
            });
            let error = new BadRequest(err.name);
            error.errors = errors;
            next(error);
        }
        req.body = result;
        next();
    });
};