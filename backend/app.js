var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./controller/user');
var trainRouter = require('./controller/train');
var modelRouter = require('./controller/model');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/train', trainRouter);
app.use('/model', modelRouter);

module.exports = app;
