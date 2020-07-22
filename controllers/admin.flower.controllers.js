const Flower = require('../models/flower');

exports.addFlower = async (req, res) => {
    try {
        let flower = new Flower(req.body);
        
        const decoded = fs.readFileSync(req.file.path).toString('base64');
        flower.image = {
            contentType: req.file.mimetype,
            data: new Buffer(decoded, 'base64')
        }
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

        let flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        if (req.file) {
            const decoded = fs.readFileSync(req.file.path).toString('base64');
            flower.image = {
                contentType: req.file.mimetype,
                data: new Buffer(decoded, 'base64')
            }
        }
        flower.search_text = flower.flower_name + " " + flower.description;

        const result = await flower.save();
        res.status(200).json({ flower: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};

exports.deleteFlower = async (req, res) => {
    try {
        let flower = await Flower.findOne({ _id: req.params.id, status: 'active' });
        flower.status = 'disabled';
        const result = await flower.save();
        res.status(200).json({ flower: result });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};