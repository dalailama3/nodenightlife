'use strict';

module.exports = function (app, passport){
  app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/public/html/index.html')

  })

  app.get('/login', function (req, res) {
    res.send("Login Page")
  })
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
