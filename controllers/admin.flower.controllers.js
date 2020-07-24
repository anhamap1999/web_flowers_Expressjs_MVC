const Flower = require('../models/flower');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');

exports.addFlower = async (req, res, next) => {
    try {
        let flower = new Flower(req.body);

        const decoded = fs.readFileSync(req.file.path).toString('base64');
        flower.image = {
            contentType: req.file.mimetype,
            data: new Buffer(decoded, 'base64')
        }
        flower.search_text = flower.flower_name + " " + flower.description;

        const savedFlower = await flower.save();

        const result = new Result('Add successfully', savedFlower);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.updateFlower = async (req, res, next) => {
    try {
        await Flower.findOneAndUpdate({ _id: req.params.id, status: 'active' }, req.body);

        let flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        if (req.file) {
            const decoded = fs.readFileSync(req.file.path).toString('base64');
            flower.image = {
                contentType: req.file.mimetype,
                data: new Buffer(decoded, 'base64')
            }
        }
        flower.search_text = flower.flower_name + " " + flower.description;

        await flower.save();

        const result = new Result('Update successfully');
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Flower not found', 'flower_id', 'invalid', 'Invalid flower_id');
        next(error);
    }
};

exports.deleteFlower = async (req, res, next) => {
    try {
        let flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        flower.status = 'disabled';

        await flower.save();

        const result = new Result('Delete successfully');
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Flower not found', 'flower_id', 'invalid', 'Invalid flower_id');
        next(error);
    }
};