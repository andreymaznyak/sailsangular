/**
 * Created by Андрей on 29.09.2015.
 */
angular.module('messages',['ui.router','sails.io', 'models.messages'])

.config(['$stateProvider',function config($stateProvider){
    $stateProvider.state('messages', {
      url: '/homepage',
      views: {
        "content": {
          controller: 'MessagesCtrl',
          templateUrl: 'messages/view.tpl.html' //'constructor/objectonto'//
        }
      },
      resolve: {
        messages: function(MessageManager) {
          return MessageManager.getAll().then(function(messages) {
            return messages;
          });
        }
      }
    })

}])
.service('MessageManager', ['$sailsSocket', MessageManager])
.controller('MessagesCtrl',['$scope', '$sailsSocket', 'MessageManager', 'messages', MessagesCtrl] )
;
function MessageManager($sailsSocket) {
  var apiUrl = '/api/messages';
  this.getAll = function () {
    return $sailsSocket.get(apiUrl).then(success, error);
  };

  this.create = function (newModel) {
    return $sailsSocket.post(apiUrl, newModel).then(success, error);
  };

  this.delete = function (model) {
    return $sailsSocket.delete(apiUrl + '/' + model.id).then(success, error);
  };

  var success = function (response) {
    return response.data;
  };

  var error = function (error) {
    console.log(error);
  };
}

function MessagesCtrl($scope, $sailsSocket, MessageManager, messages) {
  var lodash = _;
  $scope.messages = messages;

  $sailsSocket.subscribe('messages', function (envelope) {
    switch(envelope.verb) {
      case 'created':
        $scope.messages.push(envelope.data);
        $scope.$apply();
        break;
      case 'destroyed':
        lodash.remove($scope.messages, {id: envelope.id});
        break;
    }
  });
  $scope.createMessage = function(newMessage) {
    MessageManager.create(newMessage).then(function(model) {
      console.log(model);
      $scope.messages.push(model);
      $scope.newMessage = {};
    });
  };

  $scope.destroyMessage = function(message) {
    // check here if this message belongs to the currentUser
    MessageManager.delete(message).then(function(model) {
      // message has been deleted, and removed from $scope.messages
      lodash.remove($scope.messages, {id: message.id});
    });
  };

}
