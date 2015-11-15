var mongoose = require('mongoose');

var Schema   = new mongoose.Schema({

    from: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User'  
    }, 
    
    link: { 
      type: String,
    }

});

module.exports = mongoose.model('Video', Schema);