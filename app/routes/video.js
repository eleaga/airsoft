var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var Video = require('../models/Video.js');

module.exports = function (app) {
  
  router.post('/save', function(req, res) {
 
    Video.save(req.user.id, req.body.link, function(result){
      res.json(1);
    });

  })  
  
  router.post('/delete', function(req, res) {
 
      Video.remove(req.user.id, req.body.link, function(cb){
        res.json(1)
      });

  })   

  return router;
};

