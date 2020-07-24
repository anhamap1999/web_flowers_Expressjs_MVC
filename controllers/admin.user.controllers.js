const User = require('../models/user');
const Cart = require('../models/cart');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');
const perPage = 20;

exports.listUsers = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;

        const users = await User.find({ status: 'active' }).limit(perPage).skip(perPage * page);

        const result = new Result('Successful', users, await User.countDocuments({ status: 'active' }) / perPage);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.getUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username, status: 'active' });
        if (!user) {
            throw new BadRequest('User not found', 'username', 'invalid', 'Invalid username');
        }
        const result = new Result('Successful', user);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteUserByAdmin = async (req, res, next) => {
    try {
        let user = await User.findOne({ username: req.params.username, status: 'active' });
        if (!user) {
            throw new BadRequest('User not found', 'username', 'invalid', 'Invalid username');
        }

        let cart = await Cart.findOne({ username: req.params.username, status: 'active' });
        if (cart) {
            cart.status = 'disabled';
            await cart.save();
        }
        user.status = 'disabled';
        await user.save();

        const result = new Result('Delete successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};