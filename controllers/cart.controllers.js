const Cart = require('../models/cart');

exports.listCarts = (req, res) => {
    Cart.find({}, (err, carts) => {
        if (err) {
            res.status(500).json(err);
        } else if (carts) {
            res.status(200).json({carts: carts});
        } else {
            res.status(404).json({message: 'Cart not found!'})
        }        
    });
};

exports.getCart = (req, res) => {
    //Cart.findOne({username: req.jwtDecoded.data.username}, (err, cart) => {
    Cart.findOne({username: req.role === "admin" ? req.params.username : req.jwtDecoded.data.username}, (err, cart) => {
        if (err) {
            res.status(500).json(err);
        } else if (cart) {
            res.status(200).json({cart: cart});
        } else {
            res.status(404).json({message: 'Cart not found!'})
        }        
    });
};

exports.addItem = (req, res) => {
    var {flower_id, quatity, unit_price} = req.body;
    //Cart.findOne({username: req.jwtDecoded.data.username}, (err, cart) => {
    Cart.findOne({username: req.params.username}, (err, cart) => {
        if (err) {
            res.status(500).json(err);
        } else if (!cart && quatity <= 0) {
            res.status(400).json('Invalid request!');
        }
        else if (cart) {
            var indexFound = cart.items.findIndex(item => {
                return item.flower_id === flower_id;
            });
            if (indexFound !== -1 && quatity <= 0) {
                cart.items.splice(indexFound, 1);
            }
            else if (indexFound !== -1) {
                cart.items[indexFound].quatity += quatity;
                cart.total_price += quatity * unit_price;
            }
            else if (quatity > 0) {
                cart.items.push({
                    flower_id: flower_id,
                    quatity: quatity,
                    unit_price: unit_price
                });
                cart.total_price += quatity * unit_price;
            } else {
                res.status(400).json('Invalid request!');
            }
            
            cart.save((err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                res.status(200).json({cart: result});
            });
        } else {
            var cartData = {
                username: req.jwtDecoded.data.username,
                items: {
                    flower_id: flower_id,
                    quatity: quatity,
                    unit_price: unit_price
                },
                total_price: quatity * unit_price
            }
            var cart = new Cart(cartData);
            cart.save((err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                res.status(200).json({cart: result});
            });
        }
    })
};

exports.deleteItem = (req, res) => {
    //Cart.findOne({username: req.jwtDecoded.data.username})
    Cart.findOne({username: req.params.username})
        .then(cart => {
            var indexFound = cart.items.findIndex(item => {
                return item.flower_id == req.params.id;
            });
            if (indexFound > -1) {
                cart.total_price -= cart.items[indexFound].quatity * cart.items[indexFound].unit_price;
                cart.items.splice(indexFound, 1);
                return cart.save();
            } else {
                res.status(400).json('Invalid request!');
            }
        })
        .then(result => {
            res.status(200).json({cart: result});
        })
        .catch(error => {
            res.json(error);
        });
};