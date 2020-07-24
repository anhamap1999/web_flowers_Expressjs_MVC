const jwtHelper = require('../helpers/jwt.helper');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const { BadRequest, NotFound, Unauthorized, Forbidden } = require('../utils/error');
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
            error = new Unauthorized('Unauthorized!');
            next(error);
        }
    } else {
        const error = new BadRequest('No token provided!', 'refresh_token', 'invalid', 'No token provided!');
        next(error);
    }
}