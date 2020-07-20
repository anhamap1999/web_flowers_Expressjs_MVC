const Flower = require('../models/flower');
const Joi = require('joi');

exports.flowerValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        category_id: Joi.string().max(50).required(),
        flower_name: Joi.string().max(50).required(),
        unit_price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
        image: {
            image_name: Joi.string().required()
        },
        description: Joi.string().max(1000),
    });

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.status(400).json(err);
        }
        req.body = result;
        next();
    });
};