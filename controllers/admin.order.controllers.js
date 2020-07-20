const Order = require('../models/order');
const perPage = 20;

exports.listOrdersByAdmin = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const orders = await Order.find({ status: 'active' }).limit(perPage).skip(perPage * page);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            throw error;
        }
    } catch (error) {
        res.status(404).json({ message: 'Order not found!' });
    }
};

exports.getOrderByAdmin = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, status: 'active' });
        res.status(200).json({ order: order });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request!' });
    }
};
