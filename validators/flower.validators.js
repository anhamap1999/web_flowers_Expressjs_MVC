const Flower = require('../models/flower');
const Joi = require('joi');
const { BadRequest } = require('../utils/error');

exports.flowerValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        category_id: Joi.string().max(50).required(),
        flower_name: Joi.string().max(50).required(),
        unit_price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
        description: Joi.string().max(1000),
    });

    Joi.validate(req.body, schema, {abortEarly: false}, (err, result) => {
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