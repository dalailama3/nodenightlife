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
      yelp.search({ term: 'bars', location: req.query.location })
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
      var cur_time = new Date()
      var yesterday = cur_time.setDate(cur_time.getDate() - 1)

      RSVPS.find({'id': req.params.id})
      .exec(function (err, rsvp) {
        if (err) { throw err}
        else if (rsvp) {
          console.log(rsvp[0])
          res.json(rsvp[0])
        } else {
          console.log("nothing found")
          res.json({going: 0})
        }
      })
    }
  }





}())
