const Flower = require('../models/flower');
const perPage = 20;

exports.listFlowers = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ status: 'active' }).limit(perPage).skip(perPage * page);
        if (flowers.length > 0) {
            res.status(200).json({ flowers: flowers });
        } else {
            throw error;
        }
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
};

exports.getFlower = async (req, res) => {
    try {
        const flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        res.status(200).json({ flower: flower });
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
};

exports.getFlowerByCategory = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ category_id: req.query.category_id, status: 'active' }).limit(perPage).skip(perPage * page);
        if (flowers.length > 0) {
            res.status(200).json({ flowers: flowers });
        } else {
            throw error;
        }
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
};

exports.searchFlower = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const flowers = await Flower.find({ $text: { $search: req.query.keyword }, status: 'active' }).limit(perPage).skip(perPage * page);
        if (flowers.length > 0) {
            res.status(200).json({ flowers: flowers });
        } else {
            throw error;
        }
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
};