var Vote = require('../models/Vote.js');
var Team = require('./TeamSchema.js');
var pagination = require('../common/pagination.js');
var User = require('../models/User.js');
var ObjectId = require('mongoose').Types.ObjectId; 
var q = require('q');

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

  last: function(qt, cb){

    var deferred = q.defer();

    var promise = Team.find().limit(qt).sort('-_id');
    
    promise.then(function(teams) {
      deferred.resolve(teams);
    });

    return deferred.promise;

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

    var members = User.find({team: new ObjectId(id)}).exec();
    var promise = Team.findById(id).populate('owner').exec();

    promise
      .then(function(team) {
        members.then(function(member){
          time={members:member, team: team};     

          //contabiliza os votos
          Vote.total(id, 0, function(voteCb){
            team.negative = voteCb;
            Vote.total(id, 1, function(voteCb){
              team.positive = voteCb;
              cb(time);
            })
          })

        })
      },

      function(err) {
        cb(false);
      }
    );

  },

  update: function(fields, id, userId){
    var deferred = q.defer();

    var promiseTime = Team.findById(id, function(err, team) {
      
        console.log('a')
      if (err) {
        deferred.reject(new Error("Can't do it"));
        return deferred.promise;
      }

      if(team.owner!=userId){
        deferred.reject(new Error("Can't do it"));
        return deferred.promise;
      }
      else{
        console.log(fields)
        var data = {name: fields.name, city: fields.city, uf: fields.uf}
        Team.update({ _id: id }, data, { multi: false }, function(err, teamCb) {
          

        });
      }
    });

    deferred.resolve(promiseTime);
    return deferred.promise;

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

  remove: function(from, id, cb){
    Team.remove( {$and: [  { _id: new ObjectId(id), owner: from } ] }, function(err) {
      cb(1);
    });

  },

  image: function(id, image, cb){
      

    Team.update({ _id: id }, { picture: image }, { multi: false }, function(err) {
      
      return cb(true);
    });
  },

}

