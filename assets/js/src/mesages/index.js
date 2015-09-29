/**
 * Created by Андрей on 29.09.2015.
 */
angular.module('messages',['ui.router'])

.config(['$stateProvider',function config($stateProvider){
    $stateProvider.state('messages', {
      url: '/messages',
      template: '<h1>Hello world</h1>'
    })

  }])
.controller()
