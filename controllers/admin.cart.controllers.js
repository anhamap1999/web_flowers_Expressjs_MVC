const Cart = require('../models/cart');

exports.listCarts = async (req, res) => {
    try {
        const carts = await Cart.find({ status: 'active' });
        const users = carts.map(cart => {
            return cart.username;
        });
        jsonObject = users.map(JSON.stringify);
        uniqueSet = new Set(jsonObject);
        uniqueUsers = Array.from(uniqueSet).map(JSON.parse);

        let result = [];
        uniqueUsers.forEach(user => {
            const cartsByUser = carts.filter(cart => {
                return cart.username === user;
            });
            let data = {
                username: user,
                total_price: 0,
                items: cartsByUser.map(cart => {
                    return cart.item;
                })
            }
            data.items.forEach(item => {
                data.total_price += item.quantity * item.unit_price;
            });
            result.push(data);
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};