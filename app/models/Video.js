var Video = require('../models/VideoSchema.js');
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {

  list: function(id, cb){
    var promise = Video.find({from: new ObjectId(id) });
    
    promise.then(function(videos) {
      
      cb(videos);

    });

  },

  save: function(from, link, cb){
    if(link==''){
      cb(0);
    }else{
      var video = new Video({from: from, link: link});

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
    Video.remove({ _id: new ObjectId(vid) }, function(err) {
      cb(1);
    });

  }

}