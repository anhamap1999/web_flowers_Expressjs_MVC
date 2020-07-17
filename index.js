const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const url = require('url');
const multer = require('multer');


const app = express();

mongoose.connect("mongodb://localhost:27017/flowers_database", {useNewUrlParser: true});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//app.use(multer().array());
//app.use(express.static('public'));

app.use(express.json());

const router = require('./routes/index');
app.use(router);

const server = app.listen(27017, () => {
    console.log("Listen to 27017 port");
});