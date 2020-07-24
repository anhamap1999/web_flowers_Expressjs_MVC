const Order = require('../models/order');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');
const perPage = 20;

exports.listOrdersByAdmin = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const orders = await Order.find({ status: 'active' }).limit(perPage).skip(perPage * page);
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

exports.getOrderByAdmin = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, status: 'active' });
        const result = new Result('Successful', order);
        res.status(200).send(result);
    } catch (error) {
        error = new BadRequest('Order not found', 'order_id', 'invalid', 'Invalid order_id');
        next(error);
    }
};
