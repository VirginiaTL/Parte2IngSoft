'use strict';

var app = angular.module('App', ['ngRoute']);


app.controller('ListController', function ($scope, $http) {
     $scope.messages = [];

     $scope.recargar=function(){
     $http.get("http://localhost:4044/videos")
     .success(function (data) {
      $scope.messages = data;
     });
   }
  })
