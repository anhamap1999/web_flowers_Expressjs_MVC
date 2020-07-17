const Flower = require('../models/flower');
const accents = require('remove-accents');

exports.listFlowers = (req, res) => {
    Flower.find({}, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            res.status(200).json({flowers: flowers});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    })
};

exports.getFlower = (req, res) => {
    Flower.findById(req.params.id, (err, flower) => {
        if (err) {
            res.status(500).json(err);
        } else if (flower) {
            res.status(200).json({flower: flower});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });
};

exports.getFlowerByCategory = (req, res) => {    
    Flower.find({category_id: req.query.category_id}, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            res.status(200).json({flowers: flowers});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });
};

exports.addFlower = (req, res) => {
    var data = {
        "category_id": req.body.category_id,
        "flower_name": req.body.flower_name,
        "unit_price": req.body.unit_price,
        "quatity": req.body.quatity,
        "image": {
            //"image_name": req.files.image.name,
            "image_name": req.body.image,
            "image_path": "../uploads"
        },
        "description": req.body.description
    }           
    var flower = new Flower(data);    
    flower.save((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({flower: result})
        }
    });
};

exports.updateFlower = (req, res) => {          
    Flower.findById(req.params.id, (err, flower) => {
        if (err) {
            res.status(500).json(err);
        }        
        else if (flower) {            
            var update = {
                "category_id": req.body.category_id ? req.body.category_id : flower.category_id,
                "flower_name": req.body.flower_name ? req.body.flower_name : flower.flower_name,
                "unit_price": req.body.unit_price ? req.body.unit_price : flower.unit_price,
                "quatity": req.body.quatity ? req.body.quatity : flower.quatity,
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
};

exports.deleteFlower = (req, res) => {    
    Flower.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result) {
            res.status(200).json({flower: result});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });
    
};

exports.searchFlower = (req, res) => {
    var keyword = accents.remove(req.query.keyword);
    var regex = new RegExp(keyword, 'ig');
    //need to check
    Flower.find({$search: {$text: keyword}}, (err, flowers) => {
        if (err) {
            res.status(500).json(err);
        } else if (flowers.length > 0) {
            flowers = flowers.filter(flower => {
                return (accents.remove(flower.flower_name).match(regex) !== null) || (accents.remove(flower.description).match(regex) !== null);
            });
            res.status(200).json({flowers: flowers});
        } else {
            res.status(404).json({message: 'Flower not found!'});
        }
    });    
};