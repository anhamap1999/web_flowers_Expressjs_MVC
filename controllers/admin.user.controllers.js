const User = require('../models/user');
const perPage = 20;

exports.listUsers = async (req, res) => {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        const users = await User.find({ status: 'active' }).limit(perPage).skip(perPage * page);
        res.status(200).json({ users: users });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getUserByAdmin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username, status: 'active' });
        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username, status: 'active' });
        user.status = 'disabled';
        const result = await user.save();
        res.status(200).json({ user: result });
    } catch (error) {
        res.status(500).json(error);
    }
};