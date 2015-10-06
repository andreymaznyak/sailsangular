/**
 * Created by Андрей on 29.09.2015.
 */
angular.module('messages',['ui.router','sails.io'])

.config(['$stateProvider',function config($stateProvider){
    $stateProvider.state('messages', {
      url: '/messages',
      views: {
        "main": {
          controller: 'MessagesCtrl',
          template: 'sdf' //'constructor/objectonto'//
        }
      }
    })

  }])
.controller('MessagesCtrl',['$sailsSocket',
    function($sailsSocket){
    console.log('MessagesCtrl');
    $sailsSocket.get( 'localhost:1337/messages' ).then( success, error );

    function success(date){
      console.log(date);
    }

  }])
