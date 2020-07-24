const Cart = require('../models/cart');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');

exports.getCart = async (req, res, next) => {
    try {
        const carts = await Cart.find({ username: req.user.username, status: 'active' });
        if (carts.length <= 0) {
            throw new NotFound('Cart not found');
        }
        let data = {
            username: req.user.username,
            total_price: carts.reduce((total, cart) => {
                return total + cart.unit_price * cart.quantity;
            }, 0),
            items: carts.map(cart=>{
                return {flower_id: cart.flower_id, unit_price: cart.unit_price, quantity: cart.quantity};
            })
        }
        const result = new Result('Successful', data);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.addItem = async (req, res, next) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate({ username: req.user.username, status: 'active', flower_id: req.body.flower_id }, {$inc: {quantity: req.body.quantity}});
        if (!updatedCart){
            const data = {
                username: req.user.username,
                flower_id: req.body.flower_id,
                unit_price: req.body.unit_price,
                quantity: req.body.quantity
            };
            const cart = new Cart(data);
            const savedCart = await cart.save();
            
            const result = new Result('Successful', savedCart);
            res.status(200).send(result);
        } else {
            const result = new Result('Successful', updatedCart);
            res.status(200).send(result);
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ username: req.user.username, status: 'active', flower_id: req.params.id });
        cart.status = 'disabled';
        await cart.save();
        
        const result = new Result('Delete successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};