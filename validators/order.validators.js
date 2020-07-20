const Order = require('../models/order');
const Joi = require('joi');

exports.orderValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        bill_address: {
            full_name: Joi.string().max(50),
            address: Joi.string().max(100),
            phone_number: Joi.string().max(20),
            email: Joi.string().email().max(50).lowercase()
        },
        shipping_method: Joi.string().required(),
        payment_method: Joi.string().required(),
        items: [{
            flower_id: Joi.string().required(),
            flower_name: Joi.string().max(50).required(),
            unit_price: Joi.number().min(0).required(),
            quantity: Joi.number().min(1).required(),
        }]
    });
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.status(400).json(err);
        }
        req.body = result;
        next();
    });
};