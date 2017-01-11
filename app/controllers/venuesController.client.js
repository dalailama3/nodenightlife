'use strict';

(function () {



angular
  .module("nightlifeApp", ['ngResource'])
  .controller('venuesController',
      ['$scope', '$resource', function ($scope, $resource) {



    $scope.location = {
      'locale': ''
    }


    var Search = $resource('/searchYelp');

    $scope.searchYelp = function () {

      Search.get(function (results) {
        console.log("got results")
      })
    }





  }])






}())
