const Category = require('../models/category');

exports.listCategories = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) {
            res.status(500).json(err);
        } else if (categories.length > 0) {
            res.status(200).json({categories: categories});             
        } else {
            res.status(404).json({message: 'Category not found!'});
        }
    });
}

exports.getCategory = (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            res.status(500).json(err);
        } else if (category) {
            res.status(200).json({category: category});        
        } else {
            res.status(404).json({message: 'Category not found!'});
        }
    });
};

exports.addCategory = (req, res) => {
    var category = new Category(req.body);
    category.save((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({category: result});
        }
    });
};

exports.updateCategory = (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (category) {
            var update = {
                category_name: req.body.category_name ? req.body.category_name : category.category_name
            }
            category.updateOne(update, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                res.status(200).json({category: result});
            });
        }        
        else {
            res.status(404).json({message: 'Category not found!'});
        }
    });
}

exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result) {
            res.status(200).json({category: result});
        } else {
            res.status(404).json({message: 'Category not found!'});
        }
    });
};