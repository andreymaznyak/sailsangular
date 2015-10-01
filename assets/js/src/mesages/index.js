/**
 * Created by Андрей on 29.09.2015.
 */
angular.module('messages',['ui.router'])

.config(['$stateProvider',function config($stateProvider){
    $stateProvider.state('messages', {
      url: '/messages',
      views: {
        "main": {
          controller: 'MessagesCtrl',
          template: '<h1>Hello messages</h1><a ui-sref="rootstate">home </a>' //'constructor/objectonto'//
        }
      }

    })

  }])
.controller('MessagesCtrl',function(){

  })
