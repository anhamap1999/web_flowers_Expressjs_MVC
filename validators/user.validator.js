const User = require('../models/user');
const Joi = require('joi');

exports.UserValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        username: Joi.string().min(8).max(30).required().regex(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        password: Joi.string().min(6).max(100).required(),
        access_token: Joi.array().items(Joi.string()),
        refresh_token: Joi.array().items(Joi.string()),
        role: Joi.string(),
        full_name: Joi.string().max(50),
        address: Joi.string().max(100),
        phone_number: Joi.string().max(20),
        email: Joi.string().email().max(50).lowercase()
    });
    
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.status(400).json(err);
        }
        req.body = result;
        next();
    });
    
};