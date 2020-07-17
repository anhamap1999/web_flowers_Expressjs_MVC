const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const url = require('url');
const multer = require('multer');
const dotenv = require('dotenv');

const app = express();

const port = process.env.PORT;
mongoose.connect(`mongodb://localhost:${process.env.PORT}/flowers_database`, {useNewUrlParser: true});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//app.use(multer().array());
//app.use(express.static('public'));

app.use(express.json());

const router = require('./routes/index');
app.use(router);

const server = app.listen(process.env.PORT, () => {
    console.log(`Listen to ${process.env.PORT} port`);
});