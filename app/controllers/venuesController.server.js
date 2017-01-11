'use strict';


(function () {

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
      yelp.search({ term: 'food', location: 'Montreal' })
      .then(function (data) {
        console.log(data);
        res.json(data)

      })
      .catch(function (err) {
        console.error(err);
      });


    }
  }





}())
