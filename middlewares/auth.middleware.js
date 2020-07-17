const jwtHelper = require('../helpers/jwt.helper');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.isAuth = (req, res, next) => {
    //var token = req.headers["x-access-token"];
    var token = req.header('Authorization').replace('Bearer ', '');
    if (token) {        
        jwtHelper.verifyToken(token, accessTokenSecret)
            .then(decoded => {
                User.findById(decoded.data._id)
                    .then(user => {
                        req.jwtDecoded = decoded;
                        req.role = user.role;
                        req.user = user;
                        next();
                    });
            })
            .catch(error => {
                res.status(401).json({message: "Unauthorized!"});
            });
    } else {
        res.status(400).json({message: "No token provided!"});
    }
}