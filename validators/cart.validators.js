const Cart = require('../models/cart');
const Joi = require('joi');

exports.cartValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        flower_id: Joi.string().required(),
        unit_price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
    });
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.status(400).json(err);
        }
        req.body = result;
        next();
    });
};