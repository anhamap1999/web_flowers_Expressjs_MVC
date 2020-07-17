const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getUser = (req, res) => {
    User.findOne({ username: req.role === "admin" ? req.params.username : req.jwtDecoded.data.username }, (err, user) => {
        if (err) {
            res.status(500).json(err);
        } else if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    });
};

exports.listUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).json(err);
        } else if (users) {
            res.status(200).json({ users: users });
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    })
};

exports.updateUser = (req, res) => {
    User.findOne({ username: req.jwtDecoded.data.username }, (err, user) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (user) {
            const update = {
                "password": req.body.password ? bcrypt.hashSync(req.body.password, 10) : user.password,
                "access_token": user.access_token,
                "refresh_token": user.refresh_token,
                "role": user.role,
                "full_name": req.body.full_name ? req.body.full_name : user.full_name,
                "address": req.body.address ? req.body.address : user.address,
                "phone_number": req.body.phone_number ? req.body.phone_number : user.phone_number,
                "email": req.body.email ? req.body.email : user.email
            };
            user.updateOne(update, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json({ user: result });
                }
            });
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    });
};

exports.deleteUser = async (req, res) => {
    try {
        const username = req.role === "admin" ? req.params.username : req.jwtDecoded.data.username;
        const user = await User.findOneAndRemove({ username });
        const cart = await Cart.findOneAndRemove({ username });
        res.status(200).json({ user: user, cart: cart });
    } catch (error) {
        res.json(error);
    }

};