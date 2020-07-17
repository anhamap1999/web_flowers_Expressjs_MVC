const jwtHelper = require('../helpers/jwt.helper');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

exports.register = (req, res) => {    
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            res.status(500).json(err);
        }
        else if (user == null) {
            bcrypt.hash(req.body.password, 10, async(err, hash) => {
                if (err) {
                    res.status(500).json(err);
                }
                try {
                    let user = new User(req.body);
                    user.password = hash;
                    user.role = 'customer';
                    
                    const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
                    const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
                    
                    user.access_tokens.push({token : accessToken});
                    user.refresh_tokens.push({token : refreshToken});
                    
                    const result = await user.save();
                    res.status(201).json({user: result});        
                } catch(error) {
                    res.status(500).json(error);
                }                
            });
        } else {
            //LACK OF STATUS CODE: 400 bad request
            res.json({message: "Username has been registered!"});
        }
    });
};

exports.login = (req, res) => {
    User.findOne({username: req.body.username}, async(err, user) => {
        if (err) {
            res.status(500).json(err);
        }       
        else if (user == null) {
            //LACK OF STATUS CODE
            res.json({message: "Username has not been registered yet!"});
        }
        await bcrypt.compare(req.body.password, user.password, async(err, result) => {
            if (err) {
                res.status(500).json(err);
            }
            else if (result === false) {
                //LACK OF STATUS CODE
                res.json({message: "Password is incorrect!"});                
            }
            else {
                try {
                    const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
                    const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);

                    user.access_tokens.push({token : accessToken});
                    user.refresh_tokens.push({token : refreshToken});
                    
                    await user.save();
                    
                    res.status(200).json({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });                   
                } catch(error) {
                    res.status(500).json(error);
                }
                              
            }
        });
    });
};

exports.refreshToken = async(req, res) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshToken, refreshTokenSecret);
            User.findById(decoded.data._id, async(err, user) => {
                if (err || !user) {
                    throw err;
                } else {
                    const indexFound = user.refresh_tokens.findIndex(tokens => {
                        return tokens.token === refreshToken;
                    });
                    const accessToken = await jwtHelper.generateToken(decoded.data, accessTokenSecret, accessTokenLife);

                    user.access_tokens[indexFound].token = accessToken;
                    user.save();
                    res.status(200).json({access_token: accessToken});                                      
                }
            });  
        } catch(error) {   
            //LACK OF STATUS CODE 
            res.json({message: "Invalid refresh token!"});
        }
    } else {
        //LACK OF STATUS CODE
        res.json({message: "No token provided!"});
    }
};

exports.logout = async(req, res) => {
    const accessToken = req.header('Authorization').replace('Bearer ', '');
    if (accessToken) {
        try {
            const decoded = await jwtHelper.verifyToken(accessToken, accessTokenSecret);
            User.findById(decoded.data._id, (err, user) => {
                if (err || !user) {
                    throw err;
                } else {
                    const indexFound = user.access_tokens.findIndex(tokens => {
                        return tokens.token === accessToken;
                    });
                    user.access_tokens.splice(indexFound, 1);
                    user.refresh_tokens.splice(indexFound, 1);
                    user.save();
                    res.status(200).json({message: "Logout successfully!"});
                }
            });
        } catch(error) {
            res.status(500).json(error);
        }
    } else {
        //LACK OF STATUS CODE
        res.json({message: "No token provided!"});
    }
};