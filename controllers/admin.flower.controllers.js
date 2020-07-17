const Flower = require('../models/flower');
//const accents = require('remove-accents');

exports.addFlower = async (req, res) => {
    try {
        let flower = new Flower(req.body);
        //flower.image.image_name = req.files.image.name;

        flower.search_text = flower.flower_name + " " + flower.description;

        const result = await flower.save();
        res.status(201).json({ flower: result });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateFlower = async (req, res) => {
    try {
        await Flower.findOneAndUpdate({ _id: req.params.id, status: 'active' }, req.body);

        //flower.image.image_name = req.files.image.name;
        const flower = await Flower.findOne({ _id: req.params.id, status: 'active' });

        flower.search_text = flower.flower_name + " " + flower.description;

        const result = await flower.save();
        res.status(200).json({ flower: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};

exports.deleteFlower = async (req, res) => {
    try {
        const flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        flower.status = 'disabled';
        const result = await flower.save();
        res.status(200).json({ flower: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};