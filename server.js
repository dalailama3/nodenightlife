var express = require('express');
var routes = require('./routes')
var passport = require('passport')
var session = require('express-session')
var app = express()
require('dotenv').load();
require('./app/config/passport')(passport);


app.use(session({
    secret: 'sessionSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport)

app.listen('8080')
