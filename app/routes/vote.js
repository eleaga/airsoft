var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var Vote = require('../models/Vote.js');

module.exports = function (app) {
  
  router.post('/', function(req, res) {
  
    if(req.user){
      console.log('rota >' +req.user.id +' - '+ req.body.to+' - ' + req.body.value )
      Vote.save(req.user.id, req.body.to, req.body.value, function(cb){
        res.json(cb);  
      });
    }else{
      res.json(0);
    }

  })   

  return router;
};

