const jwtHelper = require('../helpers/jwt.helper');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.isAuth = async (req, res, next) => {
    //var token = req.headers["x-access-token"];
    const token = req.header('Authorization').replace('Bearer ', '');
    if (token) {
        try {
            const decoded = await jwtHelper.verifyToken(token, accessTokenSecret);
            const user = await User.findOne({ _id: decoded.data._id, status: 'active' });
            req.jwtDecoded = decoded;
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized!" });
        }
    } else {
        res.status(400).json({ message: "No token provided!" });
    }
}