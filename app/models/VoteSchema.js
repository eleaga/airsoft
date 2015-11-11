var mongoose = require('mongoose');

var Schema   = new mongoose.Schema({

    from: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User'  
    }, 
    
    to: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User' 
    }, 

    value: { 
      type: Number, 
    }

});

module.exports = mongoose.model('Vote', Schema);