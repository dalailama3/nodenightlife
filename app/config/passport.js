'use strict';

var TwitterStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
     User.findById(id, function (err, user) {
         done(err, user);
     });
 });

 passport.use(new TwitterStrategy({

       consumerKey: configAuth.twitterAuth.consumerKey,
       consumerSecret: configAuth.twitterAuth.consumerSecret,
       callbackURL: configAuth.twitterAuth.callbackURL

   },
   function(token, tokenSecret, profile, done) {

       // make the code asynchronous
   // User.findOne won't fire until we have all our data back from Twitter
       process.nextTick(function() {

           User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
               if (err)
                   return done(err);

               if (user) {
                   return done(null, user); // user found, return that user
               } else {
                   // if there is no user, create them
                   var newUser = new User();

                   // set all of the user data that we need
                   newUser.twitter.id          = profile.id;
                   newUser.twitter.token       = token;
                   newUser.twitter.username    = profile.username;
                   newUser.twitter.displayName = profile.displayName;

                   // save our user into the database
                   newUser.save(function(err) {
                       if (err)
                           throw err;
                       return done(null, newUser);
                   });
               }
           });

   });

   }));
};
