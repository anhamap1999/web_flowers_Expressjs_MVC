const express = require('express');

const app = express();

const flowerRouter = require('./flower');
const userRouter = require('./user');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
const searchRouter = require('./search');
const orderRouter = require('./order');

app.use('/flower', flowerRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/cart', cartRouter);
app.use('/search', searchRouter);
app.use('/order', orderRouter);

module.exports = app;