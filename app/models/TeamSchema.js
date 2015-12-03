var mongoose = require('mongoose');


var Schema   = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  }, 
  picture: {
    type: String
  }, 
  uf: {
    type: String
  }, 
  city: {
    type: String
  }, 
  recruiting: {
    type: Boolean 
  }, 
  email: {
    type: String 
  }, 
  owner: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User' 
  }

});

module.exports = mongoose.model('Team', Schema);