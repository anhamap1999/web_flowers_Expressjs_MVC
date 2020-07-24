const jwtHelper = require('../helpers/jwt.helper');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const resetPasswordTokenSecret = process.env.RESET_PASSWORD_TOKEN_SECRET;
const resetPasswordTokenLife = process.env.RESET_PASSWORD_TOKEN_LIFE;

const Result = require('../utils/result');
const { BadRequest, NotFound, Unauthorized, Forbidden } = require('../utils/error');

exports.register = async (req, res, next) => {
    try {
        const existed_user = await User.findOne({ username: req.body.username });
        if (existed_user) {
            throw new BadRequest('Username has been registered', 'username', '', '');
        }

        let user = new User(req.body);

        const [accessToken, refreshToken, hash] = await Promise.all([
            jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife),
            jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife),
            bcrypt.hash(user.password, 10)
        ]);

        user.password = hash;
        user.access_tokens.push({ token: accessToken });
        user.refresh_tokens.push({ token: refreshToken });

        const savedUser = await user.save();

        const result = new Result('Register successfully', savedUser);
        res.status(201).send(result);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username, status: 'active' });
        if (!user) {
            throw new BadRequest('Username has not been registered', 'username', '', '');
        }
        const compare_result = await bcrypt.compare(req.body.password, user.password);
        if (!compare_result) {
            throw new BadRequest('Password is incorrect', 'password', 'incorrect', '');
        }

        const [accessToken, refreshToken] = await Promise.all([
            jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife),
            jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife)
        ]);

        user.access_tokens.push({ token: accessToken });
        user.refresh_tokens.push({ token: refreshToken });
        await user.save();

        const data = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        const result = new Result('Login successfully', data);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshToken, refreshTokenSecret);
            if (!decoded) {
                throw new BadRequest('Invalid refresh token', 'refresh_token', 'invalid', 'Invalid refresh_token');
            }

            const user = await User.findOne({ _id: decoded.data._id, status: 'active' });

            const indexFound = user.refresh_tokens.findIndex(tokens => {
                return tokens.token === refreshToken;
            });
            const accessToken = await jwtHelper.generateToken(decoded.data, accessTokenSecret, accessTokenLife);

            user.access_tokens[indexFound].token = accessToken;
            await user.save();

            const result = new Result('Refresh token successfully', { accessToken: accessToken });
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    } else {
        const error = new BadRequest('No token provided', 'refresh_token', 'invalid', 'Invalid refresh_token');
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const accessToken = req.header('Authorization').replace('Bearer ', '');
        const user = req.user;

        const indexFound = user.access_tokens.findIndex(tokens => {
            return tokens.token === accessToken;
        });

        user.access_tokens.splice(indexFound, 1);
        user.refresh_tokens.splice(indexFound, 1);

        await user.save();

        const result = new Result('Logout successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email, status: 'active' });
        if (!user) {
            throw new BadRequest('User not found', 'email', 'invalid', 'Email not found');
        }
        const resetPasswordToken = await jwtHelper.generateToken(user, resetPasswordTokenSecret, resetPasswordTokenLife);

        //res.json(`http://localhost:27017/user/reset-password/${resetPasswordToken}`);
        /*
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "",
                pass: ""
            }
        });
        const mailOptions = {
            to: user.email,
            from: "",
            subject: "Reset password",
            text: "http://"
        };
        transporter.sendMail(mailOptions);*/

        const result = new Result('Send mail successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = req.params.token;
        const decoded = await jwtHelper.verifyToken(resetPasswordToken, resetPasswordTokenSecret);
        if (!decoded) {
            throw new BadRequest('Token expires', 'resetPasswordToken', 'invalid', 'Invalid resetPasswordToken');
        }
        let user = await User.findOne({ _id: decoded.data._id, status: 'active' });
        const hash = await bcrypt.hash(req.body.new_password, 10);
        const compare_result = await bcrypt.compare(req.body.confirm_new_password, hash);
        if (!compare_result) {
            throw new BadRequest('Passwords do not match', 'new_password, confirm_new_password', 'invalid', 'Passwords do not match');
        }
        user.password = hash;
        await user.save();

        /*
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "",
                pass: ""
            }
        });
        const mailOptions = {
            to: user.email,
            from: "",
            subject: "Reset password",
            text: "http://"
        };
        transporter.sendMail(mailOptions);*/

        const result = new Result('Reset password successfully');
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};