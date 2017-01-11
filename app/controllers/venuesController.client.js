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




    $scope.searchYelp = function () {
      var location = this.location.locale
      var Search = $resource('/searchYelp', { 'location': location });
      Search.get(function (results) {
        $scope.venues = results.businesses;
      })
    }





  }])






}())
