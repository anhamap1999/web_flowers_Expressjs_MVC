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
    /*
    const flower = new Flower(req.body);
    //data.image.image_name = req.files.image.name;  
    flower.save((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({flower: result});
        }
    });
    */
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
    /*
    Flower.findById(req.params.id, (err, flower) => {
        if (err) {
            res.status(500).json(err);
        }        
        else if (flower) {            
            const update = {
                "category_id": req.body.category_id ? req.body.category_id : flower.category_id,
                "flower_name": req.body.flower_name ? req.body.flower_name : flower.flower_name,
                "unit_price": req.body.unit_price ? req.body.unit_price : flower.unit_price,
                "quantity": req.body.quantity ? req.body.quantity : flower.quantity,
                "image": {
                    //"image_name": req.files.image.name ? req.files.image.name : flower.image.image_name,
                    "image_name": req.body.image ? req.body.image : flower.image.image_name,
                    "image_path": flower.image.image_path
                },
                "description": req.body.description ? req.body.description : flower.description
            }           
            flower.updateOne(update, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json({flower: result});
                }
            });            
        } else {
            res.status(404).json({message: 'Flower is not found!'});
        }
    });
    */
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
    /*
    Flower.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result) {
            res.status(200).json({ flower: result });
        } else {
            res.status(404).json({ message: 'Flower not found!' });
        }
    });
    */
};