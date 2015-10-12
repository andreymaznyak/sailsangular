/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'getView': function(req,res){
    res.view('messages');
  },
  'count': function(req,res){
    Messages.count(function(err, result){
      if(err) res.end(err)
      else
      res.json({count:result});

    });
  }
};

