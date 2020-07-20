const Cart = require('../models/cart');

exports.getCart = async (req, res) => {
    try {
        const carts = await Cart.find({ username: req.user.username, status: 'active' });
        if (carts.length <= 0) {
            throw error;
        }
        let data = {
            username: req.user.username,
            
            //Solution 1:
            /*
            total_price: carts.reduce((total, cart) => {
                return total + cart.item.unit_price * cart.item.quantity;
            }, 0),
            items: carts.map(cart => {
                return cart.item;
            })
            */

            //Solution 2:
            /**/
            total_price: carts.reduce((total, cart) => {
                return total + cart.unit_price * cart.quantity;
            }, 0),
            items: carts.map(cart=>{
                return {flower_id: cart.flower_id, unit_price: cart.unit_price, quantity: cart.quantity};
            })
            
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ message: 'Cart not found!' })
    }
};

exports.addItem = async (req, res) => {
    if (req.body.quantity > 0) {
        try {
            //Solution 1:
            /*
            let carts = await Cart.find({ username: req.user.username, status: 'active' });
            if (carts.length > 0) {
                const indexFound = carts.findIndex(cart => {
                    return cart.item.flower_id === req.body.flower_id;
                });
                if (indexFound > -1) {
                    carts[indexFound].item.quantity += req.body.quantity;
                    const result = await carts[indexFound].save();
                    res.status(201).json(result);
                }
            }
            const data = {
                username: req.user.username,
                item: req.body
            };
            const data = {
                username: req.user.username,
                flower_id: req.body.flower_id,
                unit_price: req.body.unit_price,
                quantity: req.body.quantity
            };
            const cart = new Cart(data);
            const result = await cart.save();
            res.status(201).json(result);
            */

            //Solution 2:
            const updateResult = await Cart.findOneAndUpdate({ username: req.user.username, status: 'active', flower_id: req.body.flower_id }, {$inc: {quantity: req.body.quantity}});
            if (!updateResult){
                const data = {
                    username: req.user.username,
                    flower_id: req.body.flower_id,
                    unit_price: req.body.unit_price,
                    quantity: req.body.quantity
                };
                const cart = new Cart(data);
                const result = await cart.save();
                res.status(201).json(result);
            } else {
                res.status(200).json(updateResult);
            }
            /**/
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(400).json('Quantity must be 1 at least!');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        //Solution 1:
        /*
        let carts = await Cart.find({ username: req.user.username, status: 'active' });
        if (carts.length > 0) {
            const indexFound = carts.findIndex(cart => {
                return cart.item.flower_id === req.params.id;
            });
            if (indexFound > -1) {
                carts[indexFound].status = 'disabled';
                const result = await carts[indexFound].save();
                res.status(200).json(result);
            } else {
                throw error = { message: 'Invalid request!' };
            }
        }
        */

        //Solution 2:
        /**/
        let cart = await Cart.findOne({ username: req.user.username, status: 'active', flower_id: req.params.id });
        cart.status = 'disabled';
        const result = await cart.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};