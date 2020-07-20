const Order = require('../models/order');
const Cart = require('../models/cart');
const Flower = require('../models/flower');
const mongoose = require('mongoose');
const perPage = 20;

exports.listOrders = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const orders = await Order.find({ username: req.user.username, status: 'active' }).limit(perPage).skip(perPage * page);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            throw error;
        }
    } catch (error) {
        res.status(404).json({ message: 'Order not found!' });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ username: req.user.username, status: 'active', _id: req.params.id });
        res.status(200).json({ order: order });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};

exports.placeOrder = async (req, res) => {
    //res.json(req.jwtDecoded.data);

    if (!(Array.isArray(req.body.items) && req.body.items.length > 0)) {
        res.status(404).json({ message: 'No order item includes!' });
    }
    else {
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
        //transaction mongodb
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const update_flowers_promise = order.items.map(item => {
                //Flower.findOneAndUpdate({ _id: item.flower_id, status: 'active' }, { $inc: { quantity: -item.quantity } }, { session: session });
                Flower.findOneAndUpdate({ _id: item.flower_id, status: 'active' }, { $inc: { quantity: -item.quantity } }).session(session);
            });
            await Promise.all(update_flowers_promise);
            //Solution 1:
            /*
            const cart = await Cart.findOne({ username: order.username, status: 'active' },);
            if (cart) {
                order.items.forEach(item => {
                    const indexFound = cart.items.findIndex(item_in_cart => {
                        return item_in_cart.flower_id === item.flower_id;
                    });
                    if (indexFound > -1) {
                        cart.items[indexFound].quantity = cart.items[indexFound].quantity - item.quantity;
                        cart.total_price -= item.quantity * item.unit_price;
                        if (cart.items[indexFound].quantity <= 0) {
                            cart.items.splice(indexFound, 1);
                        }
                    }
                });
                await cart.save({ session });
            }
            */

            //Solution 2:
            
            const update_carts_promise = order.items.map(item => {
                //Cart.findOneAndUpdate({ username: order.username, status: 'active', flower_id: item.flower_id }, { $inc: { quantity: -item.quantity } }, { session: session });
                Cart.findOneAndUpdate({ username: order.username, status: 'active', flower_id: item.flower_id }, { $inc: { quantity: -item.quantity } }).session(session);
            })
            await Promise.all(update_carts_promise);
            /**/
            const result = await order.save({ session: session });
            await session.commitTransaction();
            session.endSession();
            res.status(201).json(result);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json(error);
        }
    }
};