const Cart = require('../models/cart');

exports.getCart = async (req, res) => {
    try {
        const carts = await Cart.find({ username: req.user.username, status: 'active' });
        let data = {
            username: req.user.username,
            total_price: 0,
            items: carts.map(cart => {
                return cart.item;
            })
        }
        data.items.forEach(item => {
            data.total_price += item.quantity * item.unit_price;
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ message: 'Cart not found!' })
    }
};

exports.addItem = async (req, res) => {
    if (req.body.quantity > 0) {
        try {
            const carts = await Cart.find({ username: req.user.username, status: 'active' });
            if (carts) {
                const indexFound = carts.findIndex(cart => {
                    return cart.item.flower_id === req.body.flower_id;
                });
                if (indexFound > -1) {
                    carts[indexFound].item.quantity += req.body.quantity;
                    const result = await carts[indexFound].save();
                    res.status(201).json(result);
                } else {
                    throw error = { message: 'Invalid request!' };
                }
            }
            const data = {
                username: req.user.username,
                item: req.body
            };
            const cart = new Cart(data);
            const result = await cart.save();
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(400).json('Quantity must be 1 at least!');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const carts = await Cart.find({ username: req.user.username, status: 'active' });
        if (carts) {
            const indexFound = carts.findIndex(cart => {
                return cart.item.flower_id === req.params.id;
            });
            if (indexFound > -1) {
                carts[indexFound].status = 'disabled';
                const result = await carts[indexFound].save();
                res.status(200).json(result);
            } else {
                throw error = { message: 'Invalid request!' };
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
};