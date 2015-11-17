var User = require('../models/User.js');
var Vote = require('../models/Vote.js');
var Video = require('../models/Video.js');
var bCrypt = require('bcrypt-nodejs');
var pagination = require('../common/pagination.js');

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

    console.log(filter)

    var promise = User.find(filter).limit( 20 ).skip( req.query.page*20 ).populate('team').exec();
    
    promise.then(function(users) {
      User.count(filter, function (err, count) {
        users.count=pagination.pages(count);
        cb(users);
      });

    });

  },

  find: function(id, cb){
    var promise = User.findById(id).populate('team').exec();
    
    promise.then(function(user) {
      Vote.total(id, 0, function(voteCb){
        user.negative = voteCb;
        Vote.total(id, 1, function(voteCb){
          user.positive = voteCb;
          Video.list(id,function(videos){
            user.videos = videos;
            // console.log(user);
            cb(user);
          });
          
        })
      })

    },
      function(err) {
        cb(false);
      }
    );

  },

  update: function(data, id, cb){

    User.update({ _id: id }, data, { multi: false }, function(err, userCb) {
      return cb(userCb);
    });

  },

  password: function(data, id){
    
    password = createHash(data);

    User.update({ _id: id }, { password: password }, { multi: false }, function(err) {
      return true;
    });

  },

  image: function(id, image, cb){
      
    User.update({ _id: id }, { picture: image }, { multi: false }, function(err) {
      
      return cb(true);
    });
  },

}


// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}