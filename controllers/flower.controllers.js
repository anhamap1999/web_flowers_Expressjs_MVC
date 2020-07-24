const Flower = require('../models/flower');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');
const perPage = 20;

exports.listFlowers = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ status: 'active' }).limit(perPage).skip(perPage * page);

        if (flowers.length > 0) {
            const result = new Result('Successful', flowers, await Flower.countDocuments({ status: 'active' }) / perPage);
            res.status(200).send(result);
        } else {
            throw new NotFound('Flower not found!');
        }
    } catch (error) {
        next(error);
    }
};

exports.getFlower = async (req, res, next) => {
    try {
        const flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        const result = new Result('Successful', flower);
        res.status(200).send(result);
    } catch (error) {
        error = new NotFound('Flower not found', 'flower_id', 'invalid', 'Invalid flower_id');
        next(error);
    }
};

exports.getFlowerByCategory = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ category_id: req.query.category_id, status: 'active' }).limit(perPage).skip(perPage * page);

        if (flowers.length > 0) {
            const result = new Result('Successful', flowers);
            res.status(200).send(result);
        } else {
            throw new NotFound('Flower not found');
        }
    } catch (error) {
        next(error);
    }
};

exports.searchFlower = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ $text: { $search: req.query.keyword }, status: 'active' }).limit(perPage).skip(perPage * page);

        if (flowers.length > 0) {
            const result = new Result('Successful', flowers);
            res.status(200).send(result);
        } else {
            throw new NotFound('Flower not found');
        }
    } catch (error) {
        next(error);
    }
};