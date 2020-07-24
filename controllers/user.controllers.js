const User = require('../models/user');
const Cart = require('../models/cart');
const bcrypt = require('bcrypt');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');

exports.getUser = (req, res, next) => {
    const result = new Result('Successful', req.user);
    res.status(200).send(result);
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = req.user;
        await user.update(req.body);

        const result = new Result('Update successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const user = req.user;
        
        const isAuth = await bcrypt.compare(req.body.password, user.password);
        if (!isAuth) {
            throw new BadRequest('Password is incorrect', 'password', 'invalid', 'Invalid password');
        }

        const hash = await bcrypt.hash(req.body.new_password, 10);
        const compare_result = await bcrypt.compare(req.body.confirm_new_password, hash);
        if (!compare_result) {
            throw new BadRequest('Passwords do not match', 'password', 'invalid', 'Passwords do not match');
        }
        
        user.password = hash;
        await user.save();

        const result = new Result('Update password successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = req.user;

        const cart = await Cart.findOne({ username: user.username, status: 'active' });
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