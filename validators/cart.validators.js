const Cart = require('../models/cart');
const Joi = require('joi');
const { BadRequest } = require('../utils/error');

exports.itemValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        flower_id: Joi.string().required(),
        unit_price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
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