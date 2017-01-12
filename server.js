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

var bodyParser = require('body-parser')
app.use( bodyParser.json() );

app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
app.use('/public', express.static(process.cwd() + '/public'))
routes(app, passport)

app.listen('8080')
