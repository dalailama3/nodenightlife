'use strict';
var path = process.cwd()
var SearchHandler = require(path + '/app/controllers/venuesController.server.js')
var searchHandler = new SearchHandler();
module.exports = function (app, passport) {

  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  })

  app.get('/', function (req, res) {
    res.render('index')

  })

  app.get('/login', function (req, res) {
    res.send("Login Page")
  })

  app.route('/venue/:id')
    .get(searchHandler.rsvpsCount)
    .post(searchHandler.createRSVP)

  app.get('/lastSearch', function (req, res) {
    if (req.session.lastSearch) {
      console.log("lastSearch is: ", req.session.lastSearch)
      res.send(req.session.lastSearch)
    } else {
      res.sendStatus(404);
    }
  })

  app.get('/searchYelp', searchHandler.searchYelp)

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    }))
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login')
}
