const User = require('../models/user');
const Joi = require('joi');
const { BadRequest } = require('../utils/error');

exports.registerValidator = (req, res, next) => {
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

exports.loginValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        username: Joi.string().min(8).max(30).required().regex(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        password: Joi.string().min(6).max(100).required()
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

exports.updateUserValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        full_name: Joi.string().max(50),
        address: Joi.string().max(100),
        phone_number: Joi.string().max(20),
        email: Joi.string().email().max(50).lowercase()
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

exports.forgotPasswordValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().max(50).lowercase().required()
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