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
          return MessageManager.getAll();
        }
      }
    })

}])
.service('MessageManager', ['$sailsSocket', MessageManager])
.controller('MessagesCtrl',['$scope', '$sailsSocket', 'MessageManager', 'messages', MessagesCtrl] )
;
function MessageManager($sailsSocket) {
  var data = this.data = [];
  var apiUrl = '/api/messages';
  var watching = false;
  var itemsPerPage = this.itemsPerPage = 15;

  function init(){
    $sailsSocket.get(apiUrl+'/count').then(function(response){
      watching = true;
      console.log(response);
      var count = response.data.count,
          pages = count/itemsPerPage,
          i = 0;

      console.log(pages);
      for(i; i < (pages); i++){

        console.log(apiUrl+'?limit='+itemsPerPage+'&skip=' + (i*itemsPerPage));
        $sailsSocket.get(apiUrl+'?limit='+itemsPerPage+'&skip=' + (i*itemsPerPage)).then(function(response){

          console.log(response);
          data.push(response.data);//[j]);

        },error);
      }
      $sailsSocket.subscribe('messages', function (envelope) {
        switch(envelope.verb) {
          case 'created':
            data[i].push(envelope.data);
            break;
          case 'destroyed':
            lodash.remove(data, {id: envelope.id});
            break;
        }
      });
    },error);
  }

  this.getAll = function () {
    if(!watching)
      init()
    return data;
  };

  this.create = function (newModel) {
    return $sailsSocket.post(apiUrl, newModel).then(created, error);
  };

  this.delete = function (model) {
    return $sailsSocket.delete(apiUrl + '/' + model.id).then(success, error);
  };
  var created = function (response) {
    if(data[data.length - 1].length < itemsPerPage){
      data[data.length - 1].push(response.data);
    }else{
      data[data.length] = [response.data];
    }
    console.log(response.data);
    return response.data;
  }
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
      lodash.remove($scope.messages, {id: message.id});
    });
  };
  //-->pagination
  $scope.currentPage = messages.length - 1;
  $scope.maxSize = 10;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };



  //<--pagination
}
