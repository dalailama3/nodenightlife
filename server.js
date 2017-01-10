var express = require('express');
var routes = require('./routes')
var passport = require('passport')
var session = require('express-session')
var mongoose = require('mongoose')
var app = express()
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI)
app.use(session({
    secret: 'sessionSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
routes(app, passport)

app.listen('8080')
