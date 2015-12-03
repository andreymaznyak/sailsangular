/**
 * Created by AndreyMaznyak on 07.10.2015.
 */
angular.module('models.messages', [])
  .service('MessageManager', ['$sailsSocket', MessageManager]);

function MessageManager($sailsSocket) {
  var data = this.data = [];
  var apiUrl = '/api/messages';
  var watching = false;
  var itemsPerPage = this.itemsPerPage = 10;
  var lazyLoading = this.lazyLoading = true;

  this.getAll = function ( options,cb ) {
    if (!watching)
      init( options, cb );
    return data;
  };

  this.create = function (newModel) {
    return $sailsSocket.post(apiUrl, newModel).then(created, error);
  };

  this.delete = function (model) {

    return $sailsSocket.delete(apiUrl + '/' + model.id).then(deleted, error);

  };

  this.getPage = function getPage(index, cb){
    if(!data[index] || data[index].length == 0){
      $sailsSocket.get(apiUrl+'?limit='+itemsPerPage+'&skip=' + (index*itemsPerPage)).then(function(response){
        console.log(data);
        data.splice(index, 1, response.data);
        console.log(data);
        if(!!cb){
          cb();
        }
      },error);
    }
  }

  var init = this.init = function init( options, callback ){
    $sailsSocket.get(apiUrl+'/count').then(function(response){
      watching = true;
      var count = response.data.count,
        pages = count/itemsPerPage,
        i = 0;

      console.log(pages);
      for(i; i < (pages); i++){

        console.log(apiUrl+'?limit='+itemsPerPage+'&skip=' + (i*itemsPerPage));
        if(lazyLoading && i < (pages - 1)){
          data.push([]);
        }else{
          $sailsSocket.get(apiUrl+'?limit='+itemsPerPage+'&skip=' + (i*itemsPerPage)).then(function(response){

            data.push(response.data);//[j]);

          },error);
        }
      }
      $sailsSocket.subscribe('messages', function (envelope) {
        switch(envelope.verb) {
          case 'created':
            created(envelope);
            break;
          case 'destroyed':
            deleted({data:{id:envelope.id}});
            break;
        }
      });
      if(!!callback){
        callback();
      }
    },error);
  }

  function deleted(response){
    console.log(response);
    var onePagedata=[];

    for(var i = 0; i < data.length; i++){
      onePagedata = onePagedata.concat(data[i]);
    }
    _.remove(onePagedata, {id: response.data.id});

    for(var i = 0; i < data.length; i++) {
      data.pop();
    }

    var pages = onePagedata.length/itemsPerPage;

    for(var i = 0; i < pages; i++){
      data[i] = [];
      for(var j = i*itemsPerPage; (j < (i*itemsPerPage + itemsPerPage))&&(j < onePagedata.length); j++){
        data[i].push(onePagedata[j]);
      }
    }

    return response.data;
  }

  function created(response) {

    if (data.length != 0 && data[data.length - 1].length < itemsPerPage) {
      data[data.length - 1].push(response.data);
    } else {
      data[data.length] = [response.data];
    }

    console.log(response.data);
    return response.data;
  }

  function success(response) {
    return response.data;
  };

  function error(error) {
    console.log(error);
  };
}

