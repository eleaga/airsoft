var Vote = require('../models/VoteSchema.js');

module.exports = {

  total: function(id, value, cb){
    var promise = Vote.find({ to : id, value: value }).count();
    
    promise.then(function(votes) {
      
      cb(votes);

    });

  },

  save: function(from, to, value, cb){
    console.log(from + ', ' + to + ', ' +value);
    var count = Vote.find({ to : to, from: from }).count();
    
    count.then(function(votes) {

      if(votes){

        Vote.update({ to: to, from: from }, {value: value}, { multi: false }, function(err) {
          return cb(votes);
        });

      }else{

        var voto = new Vote({from: from, to: to, value: value});

        voto.save( function(error, data){

            if(error){
                cb(0);
            }
            else{
                cb(1);
            }
        });

      }
      
    });

  }

}