'use strict';

(function () {



angular
  .module("nightlifeApp", ['ngResource'])
  .controller('venuesController',
      ['$scope', '$resource', function ($scope, $resource) {


    $scope.location = {
      'locale': null
    }

    $scope.venues = []
    $scope.rsvps = {}
    $scope.user = null;
    $scope.userRsvps = []

    reload()

    function reload() {
      getLastSearch()
    }

    var lessThan24HoursOld = function (rsvps) {
      var cur_time = new Date()
      var copy_cur_time = new Date()
      var yesterday = new Date(copy_cur_time.setDate(copy_cur_time.getDate() - 1))
      var fresh = rsvps.filter((rsvp)=> {
        return new Date(rsvp.created_at) >= yesterday && new Date(rsvp.created_at) < cur_time
      })
      return fresh

    }

    var clipOffCity = function(venueId) {
      var regex = /[a-z][A-Z]/
      var m = venueId.match(regex)
      return venueId.slice(0, m.index + 1)
    }

    var recentUserRsvps = function (arr) {
      var cur_time = new Date()
      var copy_cur_time = new Date()
      var yesterday = new Date(copy_cur_time.setDate(copy_cur_time.getDate() - 1))
      var result = arr.map((rsvp)=> {
        var clippedCity = clipOffCity(rsvp.id)
        return {
          going: rsvp.going.filter((r)=> {
            return new Date(r.created_at) >= yesterday && new Date(r.created_at) < cur_time
            }).map((r)=> { return new Date(r.created_at).toDateString() + " " + new Date(r.created_at).toLocaleTimeString() }),

          id: clippedCity

          }
      })
      return result
    }

    $scope.getUserRsvps = function (userId) {
      var userRsvps = $resource('/userRsvps/:userId', { userId: userId })
      userRsvps.query(function (results) {
        $scope.userRsvps = recentUserRsvps(results);

      })

    }

    $scope.getRSVPCount = function(venues) {

      venues.forEach((venue)=> {
        var venueId = venue.name + venue.location.city
        var Count = $resource('/venue/:venueId', { venueId: venueId })
        Count.get(function (result) {
          var rsvps = result.going
          var freshRsvps = lessThan24HoursOld(rsvps)
          $scope.rsvps[result.id] = freshRsvps

        })
      })
      console.log($scope.rsvps)
    }


    $scope.searchYelp = function () {
      var location = this.location.locale
      var Search = $resource('/searchYelp', { 'location': location });
      Search.get(function (results) {
        $scope.venues = results.businesses;
        $scope.getRSVPCount($scope.venues)

      })

    }

    $scope.createRSVP = function (venueId) {
      var RSVP = $resource('/venue/:venueId', { venueId: venueId })
      RSVP.save(function (results) {
        $scope.getRSVPCount($scope.venues)
      })
    }

    function getLastSearch () {
      var lastSearch = $resource('/lastSearch')
      lastSearch.get(function (result) {
        var obj = JSON.parse(JSON.stringify(result))
        var arr = []
        for (var key in obj) {
            arr.push(obj[key])
        }

        $scope.location.locale = arr.join('')
        $scope.searchYelp()
      })
    }





  }])






}())
