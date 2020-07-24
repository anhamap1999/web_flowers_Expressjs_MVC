const Cart = require('../models/cart');
const Result = require('../utils/result');
const { BadRequest, NotFound } = require('../utils/error');
const perPage = 20;

exports.listCarts = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const carts = await Cart.find({ status: 'active' }).limit(perPage).skip(perPage * page);
        if (carts.length <= 0) {
            throw new NotFound('Cart not found');
        }
        const users = carts.map(cart => {
            return cart.username;
        });
        jsonObject = users.map(JSON.stringify);
        uniqueSet = new Set(jsonObject);
        uniqueUsers = Array.from(uniqueSet).map(JSON.parse);

        let cartsList = [];
        uniqueUsers.forEach(user => {
            const cartsByUser = carts.filter(cart => {
                return cart.username === user;
            });
            let data = {
                username: user,                
                total_price: cartsByUser.reduce((total, cart) => {
                    return total + cart.unit_price * cart.quantity;
                }, 0),
                items: cartsByUser.map(cart=>{
                    return {flower_id: cart.flower_id, unit_price: cart.unit_price, quantity: cart.quantity};
                })
            }            
            cartsList.push(data);
        });

        const result = new Result('Successful', cartsList);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};