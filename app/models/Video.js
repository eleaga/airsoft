var Video = require('../models/VideoSchema.js');

module.exports = {

  list: function(id, cb){
    var promise = Videos.find({from: id});
    
    promise.then(function(videos) {
      
      cb(videos);

    });

  },


  save: function(from, link, cb){
    console.log(from + ', ' +link);
    // var count = Vote.find({ to : to, from: from }).count();

      var video = new Video({from: from, link: link});

      video.save( function(error, data){

        if(error){
            cb(0);
        }
        else{
            cb(1);
        }

      });
  },

  remove: function(from, cb){
    // var count = Vote.find({ to : to, from: from }).count();
          console.log('1');
    Video.remove({ from: from }, function(err) {
      console.log('a');
      cb(1);
    });

  }

}