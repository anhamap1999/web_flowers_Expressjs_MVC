const Flower = require('../models/flower');
const accents = require('remove-accents');

exports.listFlowers = async (req, res) => {
    try {
        const flowers = await Flower.find({ status: 'active' });
        res.status(200).json({ flowers: flowers });
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
    /*
    Flower.find({}, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            res.status(200).json({flowers: flowers});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    })
    */
};

exports.getFlower = async (req, res) => {
    try {
        const flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        res.status(200).json({ flower: flower });
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
    /*
    Flower.findById(req.params.id, (err, flower) => {
        if (err) {
            res.status(500).json(err);
        } else if (flower) {
            res.status(200).json({flower: flower});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });
    */
};

exports.getFlowerByCategory = async (req, res) => {
    try {
        const flowers = await Flower.find({ category_id: req.query.category_id, status: 'active' });
        res.status(200).json({ flowers: flowers });
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
    /*
    Flower.find({category_id: req.query.category_id}, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            res.status(200).json({flowers: flowers});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });
    */
};

exports.searchFlower = async (req, res) => {
    try {        
        const flowers = await Flower.find({ $text: { $search: req.query.keyword }, status: 'active' });
        res.status(200).json({ flowers: flowers });
    } catch (error) {
        res.status(404).json({ message: 'Flower not found!' });
    }
    /*
    Flower.find({ $search: { $text: keyword } }, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            flowers = flowers.filter(flower => {
                return (accents.remove(flower.flower_name).match(regex) !== null) || (accents.remove(flower.description).match(regex) !== null);
            });
            res.status(200).json({ flowers: flowers });
        } else {
            res.status(404).json({ message: 'Flower not found!' });
        }
    });
    */
};