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

//const Error = require('../middlewares/error.middleware');

exports.register = async (req, res) => {
    try {
        const existed_user = await User.findOne({ username: req.body.username });
        if (existed_user) {
            throw error = { message: "Username has been registered!" };
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

        const result = await user.save();
        res.status(201).json({ user: result });
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, status: 'active' });
        if (!user) {
            throw error = { message: "Username has been registered!" };
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            throw error = { message: "Password is incorrect!" };
            //throw error = new Error()
        }
        const [accessToken, refreshToken] = await Promise.all([
            jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife),
            jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife)
        ]);
        user.access_tokens.push({ token: accessToken });
        user.refresh_tokens.push({ token: refreshToken });

        const savedUser = await user.save();
        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshToken, refreshTokenSecret);
            const user = await User.findOne({ _id: decoded.data._id, status: 'active' });
            if (!user) {
                throw error = { message: "Invalid refresh token!" };
            }
            const indexFound = user.refresh_tokens.findIndex(tokens => {
                return tokens.token === refreshToken;
            });
            const accessToken = await jwtHelper.generateToken(decoded.data, accessTokenSecret, accessTokenLife);

            user.access_tokens[indexFound].token = accessToken;
            const result = await user.save();
            res.status(200).json({ access_token: accessToken });
        } catch (error) {
            res.status(400).json(error);
        }
    } else {
        res.status(400).json({ message: "No token provided!" });
    }
};

exports.logout = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').replace('Bearer ', '');
        const user = req.user;

        const indexFound = user.access_tokens.findIndex(tokens => {
            return tokens.token === accessToken;
        });

        user.access_tokens.splice(indexFound, 1);
        user.refresh_tokens.splice(indexFound, 1);

        const result = await user.save();
        res.status(200).json({ message: "Logout successfully!" });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, status: 'active' });
        if (!user) {
            throw error = { message: "User not found!" };
        }
        const resetPasswordToken = await jwtHelper.generateToken(user, resetPasswordTokenSecret, resetPasswordTokenLife);
        //res.json(`http://localhost:27017/${resetPasswordToken}`);
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
        const result = transporter.sendMail(mailOptions);
        if (result) {
            res.status(200).json(result);
        }
        */
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = req.params.token;
        const decoded = await jwtHelper.verifyToken(resetPasswordToken, resetPasswordTokenSecret);
        if (!decoded) {
            throw error = { message: "Token expires!" };
        }
        let user = await User.findOne({ _id: decoded.data._id, status: 'active' });
        const hash = await bcrypt.hash(req.body.new_password, 10);
        const result = await bcrypt.compare(req.body.confirm_new_password, hash);
        if (!result) {
            throw error = { message: "Passwords do not match!" };
        }
        user.password = hash;
        await user.save();
        res.status(200).json({ message: "Reset password successfully!" });
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
        const result = transporter.sendMail(mailOptions);
        if (result) {
            res.status(200).json({ message: "Reset password successfully!" });
        }
        */
    } catch (error) {
        res.status(500).json(error);
    }
};