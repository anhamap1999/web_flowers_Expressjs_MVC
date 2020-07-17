const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }

        jwt.sign(
            {data: userData},
            secretSignature,
            {algorithm: "HS256", expiresIn: tokenLife},
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
    });
};

exports.verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
};