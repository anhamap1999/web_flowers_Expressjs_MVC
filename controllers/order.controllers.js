const Order = require('../models/order');
const Cart = require('../models/cart');
const Flower = require('../models/flower');
const mongoose = require('mongoose');

exports.listOrders = (req, res) => {
    Order.find({ username: req.role === "admin" ? req.params.username : req.jwtDecoded.data.username }, (err, orders) => {
        if (err) {
            res.status(500).json(err);
        } else if (orders) {
            res.status(200).json({ orders: orders });
        } else {
            res.status(404).json({ message: 'Order not found!' });
        }
    });
};

exports.getOrder = (req, res) => {
    Order.findOne({ username: req.role === "admin" ? req.params.username : req.jwtDecoded.data.username, _id: req.params.id }, (err, order) => {
        if (err) {
            res.status(500).json(err);
        } else if (order) {
            res.status(200).json({ order: order });
        } else {
            res.status(404).json({ message: 'Order not found!' });
        }
    })
};

exports.deleteOrder = (req, res) => {
    Order.findOneAndRemove({ username: req.jwtDecoded.data.username, _id: req.params.id }, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result) {
            res.status(200).json({ order: result });
        } else {
            res.status(400).json({ message: 'Invalid request!' });
        }
    });
};

exports.placeOrder = (req, res) => {
    //res.json(req.jwtDecoded.data);

    if (!(Array.isArray(req.body.items) && req.body.items.length > 0)) {
        res.status(404).json({ message: 'No order item includes!' });
    }
    else {
        const orderData = {
            username: req.jwtDecoded.data.username,
            bill_address: req.body.bill_address,
            shipping_method: req.body.shipping_method,
            payment_method: req.body.payment_method,
            items: req.body.items,
            total_price: orderData.items.reduce((total, item) => {
                return total + item.unit_price * item.quatity;
            }, 0)
        };
        

        const order = new Order(orderData);

        //CALLBACK
        //PROBLEM: MUST BE A NEST CALLBACK BECAUSE FLOWER.QUALITY MAY CAUSE ERROR DUE TO LIMITATION
        /*    
        orderData.items.forEach(item => {
            Flower.findById(item.flower_id, (err, flower) => {
                if (err) {
                    res.status(500).json(err);
                } else if (flower) {
                    flower.quatity = flower.quatity - item.quatity;
                    flower.save((err, flower) => {
                        if (err) {
                            res.status(500).json(err);
                        }
                    });
                } else {
                    res.status(404).json('Flower not found!');
                }
            });            
        });
        
        Cart.findOne({username: orderData.username}, (err, cart) => {
            if (err) {
                res.json(err);
            } else if (cart) {
                orderData.items.forEach(item => {
                    var indexFound = cart.items.findIndex(item_in_cart => {
                        return item_in_cart.flower_id === item.flower_id;
                    });
                    if (indexFound > -1) {
                        cart.items[indexFound].quatity = cart.items[indexFound].quatity - item.quatity;
                        cart.total_price -= item.quatity * item.unit_price;
                        if (cart.items[indexFound].quatity <= 0) {
                            cart.items.splice(indexFound, 1);
                        }                                     
                    }               
                });
                cart.save((err, cart) => {
                    if (err) {
                        res.status(500).json(err);
                    }
                });            
            } else {
                res.status(404).json('Cart not found!');
            }
        });
        order.save((err, order) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(201).json(order);
            }
        });
        */






        //PROMISE IN ORDER TO AVOID CALLBACK HELL
        //PROBLEM: SAVING BEFORE ALTHOUGH UPDATING AFTER MAY CAUSE ERROR DUE TO THE EXISTENCE AND LIMITATION OF DATA
        /*
        order.save()
            .then(savedOrder => {
                var update_flower_promise = savedOrder.items.map(item => {
                //savedOrder.items.map(item => {
                    return Flower.findById(item.flower_id)
                    .then(flower => {
                        flower.quatity = flower.quatity - item.quatity;
                        return flower.save();
                    });
                             
                });
                Promise.all(update_flower_promise)
                    .then(result => {

                        Cart.findOne({username: savedOrder.username})
                            .then(cart => {
                                if (cart) {
                                    savedOrder.items.forEach(item => {
                                        var indexFound = cart.items.findIndex(item_in_cart => {
                                            return item_in_cart.flower_id === item.flower_id;
                                        });
                                        if (indexFound > -1) {
                                            cart.items[indexFound].quatity = cart.items[indexFound].quatity - item.quatity;
                                            cart.total_price -= item.quatity * item.unit_price;
                                            if (cart.items[indexFound].quatity <= 0) {
                                                cart.items.splice(indexFound, 1);
                                            }                                     
                                        }
                                    });
                                    return cart.save();
                                }
                            })
                            .then(result => {
                                res.json(savedOrder);
                            })
                            
                            //.catch (error => {
                            //    return error;
                            //});               
                             
                            
                    })
                    //.catch(error => {
                        //res.json(error);
                    //    return error;
                    //});
                    });
                      
            })
            .catch(error => {
                //res.json(error);
                return error;                
            });
            */

        //transaction mongodb
        //ANOTHER PROMISE
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const update_flower_promise = order.items.map(item => {
                Flower.updateOne({ _id: item.flower_id }, { $inc: { quantity: -item.quantity } }, { session })

            });
            const result = await Promise.all(update_flower_promise);
            const cart = await Cart.findOne({ username: order.username },);
            if (cart) {
                order.items.forEach(item => {
                    const indexFound = cart.items.findIndex(item_in_cart => {
                        return item_in_cart.flower_id === item.flower_id;
                    });
                    if (indexFound > -1) {
                        cart.items[indexFound].quatity = cart.items[indexFound].quatity - item.quatity;
                        cart.total_price -= item.quatity * item.unit_price;
                        if (cart.items[indexFound].quatity <= 0) {
                            cart.items.splice(indexFound, 1);
                        }
                    }
                });
                await cart.save({session});
            }
            
            await order.save({session})
            session.commitTransaction();
        } catch (err) {
            session.abortTransaction();
            res.status(500).json(err);
        }
    }
};