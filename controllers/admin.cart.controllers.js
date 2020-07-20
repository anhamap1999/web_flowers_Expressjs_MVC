const Cart = require('../models/cart');

exports.listCarts = async (req, res) => {
    try {
        const carts = await Cart.find({ status: 'active' });
        if (carts.length <= 0) {
            res.status(404).json({ message: 'Cart not found!' });
        }
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
                //Solution 1:
                /*
                total_price: cartsByUser.reduce((total, cart) => {
                    return total + cart.item.unit_price * cart.item.quantity;
                }, 0),
                items: cartsByUser.map(cart => {
                    return cart.item;
                })
                */

                //Solution 2:
                /**/
                total_price: cartsByUser.reduce((total, cart) => {
                    return total + cart.unit_price * cart.quantity;
                }, 0),
                items: cartsByUser.map(cart=>{
                    return {flower_id: cart.flower_id, unit_price: cart.unit_price, quantity: cart.quantity};
                })
            }            
            result.push(data);
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};