// Load required packages
var mongoose = require('mongoose');

// Define our user
var PlayerSchema   = new mongoose.Schema({
    
    // username: { 
    //   type: String, 
    //   required: true, 
    //   index: {
    //     unique: true
    //   }
    // }, 

    username: { 
      type: String, 
      index: {
        unique: true
      }
    }, 

    password: { 
      type: String, 
    }, 
    email: { 
      type: String, 
    }, 
    about: { 
      type: String, 
    }, 
    name: { 
      type: String, 
    }, 
    team: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'Team' 
    }, 
    type: { 
      type: String, 
    },
    city: { 
      type: String, 
    },
    uf: { 
      type: String, 
    },
    access_token: String,
    picture: String

});



// Export the Mongoose model
module.exports = mongoose.model('User', PlayerSchema);