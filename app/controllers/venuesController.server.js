'use strict';


(function () {
  var RSVPS = require('../models/rsvps')
  require('dotenv').load()
  var yelpAPI = require('../config/yelp').yelpAPI

  var Yelp = require('yelp')
  var yelp = new Yelp({
    consumer_key: yelpAPI.consumerKey,
    consumer_secret: yelpAPI.consumerSecret,
    token: yelpAPI.yelp_token,
    token_secret: yelpAPI.yelp_token_secret,
  });


  module.exports = function SearchHandler () {


    this.searchYelp = function (req, res) {

      req.session.lastSearch = req.query.location
      yelp.search({ term: 'bars', location: req.query.location, limit: 30 })
      .then(function (data) {
        data.businesses.forEach((business)=> {
          RSVPS.update(
            {id: business.name + business.location.city},
            {$setOnInsert: { id: business.name + business.location.city }},
            {upsert: true},
            function (err, result) {
              if (err) { throw err }
            }
          )
        })
        res.json(data)

      })
      .catch(function (err) {
        console.error(err);
      });


    }

    this.rsvpsCount = function (req, res) {

      RSVPS.find({'id': req.params.id})
      .exec(function (err, rsvp) {
        if (err) { throw err}
        else if (rsvp) {
          res.json(rsvp[0])
        } else {
          console.log("nothing found")
        }
      })
    }


    this.createRSVP = function (req, res) {
      var userId = req.user._id
      var cur_time = new Date()
      var copy = new Date()
      var yesterday = copy.setDate(copy.getDate() - 1)

      RSVPS.findOneAndUpdate(
        {id: req.params.id, 'going.user': req.user._id, 'going.created_at': { $gt: new Date(yesterday), $lt: cur_time }},
        {$pull: { 'going': { 'created_at': { $gt: new Date(yesterday), $lt: cur_time }}}})
        .exec(function (err, result) {
          if (err) { throw err}
          else if (result) {
            console.log("removed an rsvp: ", result)
            res.end("removed an rsvp")
          } else {
            RSVPS.findOneAndUpdate(
              {id: req.params.id},
              {$push: {'going': { 'user': userId, 'created_at': cur_time }}})
              .exec(function (err, result) {
              if (err) { throw err}
              console.log(result)
              res.json(result)
            })
          }
        })
    }

    this.getUserRsvps = function (req, res) {
      var cur_time = new Date()
      var copy = new Date()
      var yesterday = copy.setDate(copy.getDate() - 1)

      var userId = req.params.userId
      console.log(userId)

      RSVPS.find({"going.user": userId, "going.created_at": {$gt: new Date(yesterday), $lt: cur_time}})
      .exec(function (err, results) {
        if (err) { throw err}
        console.log(results)
        res.json(results)
      })
    }


  }






}())
