var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var Video = require('../models/Video.js');

module.exports = function (app) {
  
  router.post('/save', function(req, res) {
 
      console.log(req.body )
      Video.remove(req.user.id, function(cb){
              console.log('b');
        for (i in req.body) { 
          Video.save(req.user.id, req.body[i], function(result){
            console.log(result);
          });
        }
        res.redirect('/player/'+req.user.id)
      });
      // console.log('rota video >' +req.user.id +' - '+ req.body.to+' - ' + req.body.value )
      

  })   

  return router;
};

