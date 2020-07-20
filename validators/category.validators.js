const Category = require('../models/category');
const Joi=require('joi');

exports.categoryValidator = (req,res,next)=>{
    const schema = Joi.object().keys({
        category_name: Joi.string().max(50).required()
    });
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.status(400).json(err);
        }
        req.body = result;
        next();
    });
};