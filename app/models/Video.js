var Video = require('../models/VideoSchema.js');
var Youtube = require('../common/youtube.js');
var q = require('q');
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {

  list: function(id, cb){
    var promise = Video.find({from: new ObjectId(id) });
    
    promise.then(function(videos) {
      
      cb(videos);

    });

  },

  last: function(qt){

    var deferred = q.defer();

    var promise = Video.find().limit(qt).sort('-_id');
    
    promise.then(function(videos) {
      deferred.resolve(videos);
    });

    return deferred.promise;
  
  },

  save: function(from, link, cb){
    if(link==''){
      cb(0);
    }else{
      link = Youtube.youtubeParser(link);
      if(link){
        var video = new Video({from: from, link: link});
      }
      video.save( function(error, data){

        if(error){
            cb(0);
        }
        else{
            cb(1);
        }

      });
    }
  },

  remove: function(from, vid, cb){
    Video.remove({$and: [ { _id: new ObjectId(vid), from: from } ] }, function(err) {
      cb(1);
    });

  }

}