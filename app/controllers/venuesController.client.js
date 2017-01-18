'use strict';

(function () {



angular
  .module("nightlifeApp", ['ngResource'])
  .controller('venuesController',
      ['$scope', '$resource', function ($scope, $resource) {


    $scope.location = {
      'locale': ''
    }

    $scope.venues = []
    $scope.rsvps = {}

    var lessThan24HoursOld = function (rsvps) {
      var cur_time = new Date()
      var copy_cur_time = new Date()
      var yesterday = new Date(copy_cur_time.setDate(copy_cur_time.getDate() - 1))
      var fresh = rsvps.filter((rsvp)=> {
        return new Date(rsvp.created_at) >= yesterday && new Date(rsvp.created_at) < cur_time
      })
      return fresh

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





  }])






}())
