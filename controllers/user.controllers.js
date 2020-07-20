const User = require('../models/user');
const Cart = require('../models/cart');
const bcrypt = require('bcrypt');

exports.getUser = (req, res) => {
    res.status(200).json({ user: req.user });
};

exports.updateUser = async (req, res) => {
    try {
        const user = req.user;
        const result = await user.update(req.body);
        res.status(200).json({ user: result });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ username: user.username, status: 'active' });
        if (cart) {
            cart.status = 'disabled';
            await cart.save();
        }
        user.status = 'disabled';
        await user.save();
        res.status(200).json({ message: 'Delete successfully!' });
    } catch (error) {
        res.status(500).json(error);
    }
};