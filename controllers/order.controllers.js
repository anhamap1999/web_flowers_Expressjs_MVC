const Order = require('../models/order');
const Cart = require('../models/cart');
const Flower = require('../models/flower');
const mongoose = require('mongoose');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');
const perPage = 20;

exports.listOrders = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const orders = await Order.find({ username: req.user.username, status: 'active' }).limit(perPage).skip(perPage * page);

        if (orders.length > 0) {
            const result = new Result('Successful', orders);
            res.status(200).send(result);
        } else {
            throw new NotFound('Cart not found');
        }
    } catch (error) {
        next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ username: req.user.username, status: 'active', _id: req.params.id });

        const result = new Result('Successful', order);
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Order not found', 'order_id', 'invalid', 'Invalid order_id');
        next(error);
    }
};

exports.placeOrder = async (req, res, next) => {
    const orderData = {
        username: req.user.username,
        bill_address: req.body.bill_address,
        shipping_method: req.body.shipping_method,
        payment_method: req.body.payment_method,
        items: req.body.items,
        total_price: req.body.items.reduce((total, item) => {
            return total + item.unit_price * item.quantity;
        }, 0)
    };
    const order = new Order(orderData);        
    
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const update_flowers_promise = order.items.map(item => {
            //Flower.findOneAndUpdate({ _id: item.flower_id, status: 'active' }, { $inc: { quantity: -item.quantity } }, { session: session });
            Flower.findOneAndUpdate({ _id: item.flower_id, status: 'active' }, { $inc: { quantity: -item.quantity } }).session(session);
        });
        await Promise.all(update_flowers_promise);
        
        const update_carts_promise = order.items.map(item => {
            //Cart.findOneAndUpdate({ username: order.username, status: 'active', flower_id: item.flower_id }, { $inc: { quantity: -item.quantity } }, { session: session });
            Cart.findOneAndUpdate({ username: order.username, status: 'active', flower_id: item.flower_id }, { $inc: { quantity: -item.quantity } }).session(session);
        })
        await Promise.all(update_carts_promise);
        /**/
        const savedOrder = await order.save({ session: session });
        await session.commitTransaction();
        session.endSession();

        const result = new Result('Successful', savedOrder);
        res.status(200).send(result);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};