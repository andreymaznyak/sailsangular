/**
 * Created by AndreyMaznyak on 07.10.2015.
 */
angular.module('models.messages', [])

.service('MessageModelProvider', function(config, $sailsSocket) {
  var apiUrl = config.apiUrl + '/messages';
  this.getAll = function() {
    return $sailsSocket.get(apiUrl).then(success, error);
  };

  this.create = function(newModel) {
    return $sailsSocket.post(apiUrl, newModel).then(success, error);
  };

  this.delete = function(model) {
    return $sailsSocket.delete(apiUrl).then(success, error);
  };

  var success = function(response) {
    return response.data;
  };

  var error = function(error) {
    console.log(error);
  };
});

