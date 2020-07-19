const User = require('../models/user');

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({ status: 'active' });
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
}