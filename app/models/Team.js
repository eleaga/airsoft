var Team = require('./TeamSchema.js');
var pagination = require('../common/pagination.js');
var User = require('../models/User.js');

module.exports = {

  list: function(req, cb){

    if(!req.query.skip){
      req.query.skip = 0;
    }

    if(req.query.filter){
      var name = new RegExp(req.query.filter, 'i');
      filter = {name: name };
    }else{
      filter= {};
    }

    var promise = Team.find(filter).limit( 20 ).skip( req.query.page*20 ).populate('User').exec();
    
    promise.then(function(teams) {
      console.log(teams);
      Team.count(filter, function (err, count) {
        teams.count=pagination.pages(count);
        cb(teams);
      });

    });

  },

  listByName: function(name, cb){

    var regex = new RegExp(name, 'i');
    var promise = Team.find({name:regex}).exec();
    
    promise.then(function(teams) {
      console.log(teams)
      cb(teams);

    });

  },

  find: function(id, cb){
    var promise = Team.findById(id).exec();
    
    promise.then(function(team) {
      
      cb(team);

    },
      function(err) {
        cb(false);
      }
    );

  },

  update: function(data, id){

    Team.update({ _id: id }, data, { multi: false }, function(err) {
      return true;
    });

  },

  save: function(data, cb){

        var team = new Team(data);

        team.save( function(error, team){
            if(error){
                cb(error);
            }
            else{
                cb(team._id);
            }
        });

  },

  image: function(id, image, cb){
      
    Team.update({ _id: id }, { picture: image }, { multi: false }, function(err) {
      
      return cb(true);
    });
  },

}

