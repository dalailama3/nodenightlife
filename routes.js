'use strict';

var Users = require('/models/user')


module.exports = function (app, passport){

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/login')
}
