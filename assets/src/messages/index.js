/**
 * Created by Андрей on 29.09.2015.
 */
angular.module('messages',['ui.router','sails.io', 'models.messages'])

.config(['$stateProvider',function config($stateProvider){
    $stateProvider.state('paginationMessages', {
      url: '/paginationMessages',
      views: {
        "content": {
          controller: 'PaginationMessagesCtrl',
          templateUrl: 'messages/view_pagination.tpl.html' //'constructor/objectonto'//
        }
      },
      resolve: {
        messages: function(MessageManager) {
          return MessageManager.getAll();
        }
      }
    })
    $stateProvider.state('loadingMessages', {
      url: '/loadingMessages',
      views: {
        "content": {
          controller: 'LoadingMessagesCtrl',
          templateUrl: 'messages/view_loading.tpl.html' //'constructor/objectonto'//
        }
      },
      resolve: {
        messages: function($scope, MessageManager) {
          return MessageManager.getAll({},function(data){
            if(data.length > 0){
              MessageManager.getPage(data.length - 1);
              $scope.currentPage = data.length;
            }
          });
        }
      }
    })

}])
.controller('PaginationMessagesCtrl',['$scope', '$sailsSocket', 'MessageManager', 'messages', paginationMessagesCtrl] )
.controller('LoadingMessagesCtrl',['$scope', '$sailsSocket', 'MessageManager', 'messages', loadingMessagesCtrl] )
;

function paginationMessagesCtrl($scope, $sailsSocket, MessageManager, messages) {

  $scope.messages = messages;
  $scope.itemsPerPage = MessageManager.itemsPerPage;
  console.log(messages);
  $scope.createMessage = function(newMessage) {
    MessageManager.create(newMessage).then(function(model) {
      console.log(model);
      $scope.newMessage = {};
    });
  };
  $scope.destroyMessage = function(message) {
    // check here if this message belongs to the currentUser
    MessageManager.delete(message).then(function(model) {
      // message has been deleted, and removed from $scope.messages
      console.log(model);
    });
  };
  //-->pagination
  $scope.currentPage = 1;
  $scope.maxSize = 10;
  //MessageManager.getPage($scope.currentPage - 1);


  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
    MessageManager.getPage($scope.currentPage - 1);
  };

}

function loadingMessagesCtrl($scope, $sailsSocket, MessageManager, messages) {

  $scope.messages = messages;
  $scope.itemsPerPage = MessageManager.itemsPerPage;
  console.log(messages);
  $scope.createMessage = function(newMessage) {
    MessageManager.create(newMessage).then(function(model) {
      console.log(model);
      $scope.newMessage = {};
    });

  };
  $scope.destroyMessage = function(message) {
    // check here if this message belongs to the currentUser
    MessageManager.delete(message).then(function(model) {
      // message has been deleted, and removed from $scope.messages
      console.log(model);
    });
  };
  //-->pagination
  $scope.currentPage = 1;
  $scope.maxSize = 10;

  MessageManager.getPage($scope.currentPage - 1);

  angular.element(document.querySelector('#scrollArea')).bind("scroll", function() {

    if (this.scrollHeight - this.scrollTop - this.clientHeight < 1) {
      console.log('Нужно догрузить элементы');
      if($scope.currentPage < MessageManager.data.length){
        /*for(var i = 0; i < MessageManager.data[$scope.currentPage].length; i++){
          $scope.messages.push(MessageManager.data[$scope.currentPage][i]);
        }*/
        $scope.currentPage++;
        MessageManager.getPage($scope.currentPage - 1);
        $scope.$apply();
      }
    } else {
      console.log('Пока грузить ничего не нужно');
    }
  });

}
