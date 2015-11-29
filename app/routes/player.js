var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var checkAuth = require('../common/checkAuth.js');
var upload = require('../common/upload.js');
var Players = require('../models/Player.js');
var formidable = require('formidable');

module.exports = function (app) {
  
  router.get('/', function(req, res) {
    
    Players.list(req, function(cb){
      res.render('players',{players:cb, user: req.user, page: req.query.page, filter: req.query.filter});  
    });
    
  })  


  router.get('/logout', function(req, res) {

    req.session.destroy()
    req.logout()
    res.redirect('/')
    
  })
  
  router.get('/edit', function(req, res) {

    checkAuth.auth(req,res);  

    Players.find(req.user.id, function(cb){
        
      if(cb.team){
        cb.teamName = cb.team.name;
        cb.teamId = cb.team.id;
      }else{
        cb.teamName = '';
        cb.teamId  = '';
      }

      res.render('players/edit',{user:cb});  
    });

  })

  
  router.post('/edit', function(req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {


      checkAuth.auth(req,res);  
      console.fields;
      if(fields.password){
        Players.password(fields.password, req.user.id);
      }

      if(files.image.size > 100){
        upload.imagePerfil(files.image, req.user.id, function(cb){
          if(cb){
            Players.image(req.user.id, cb, function(resultado){
              console.log('Imagem salva')
            });
          }else{
            res.send('Falha no formulario');
          }
        });
      }
      
      console.log(fields);
      data = {name : fields.name, team : fields.teamId, uf : fields.uf, city : fields.city, type : fields.type, email : fields.email, about : fields.about};
      Players.update(data, req.user.id, function(userCb){
        res.redirect(req.user.id);
      });
    
    });

  })

  router.get('/:id', function(req, res) {

    Players.find(req.params.id, function(cb){
      if(cb){
        console.log(cb)
        res.render('players/show', {player: cb, user: req.user});  
      }
      else{
        res.send('Usuario não existe.');
      }
    });
    
  })

  router.post('/', function(req, res) {
    controller.savePlayer;
  })


  return router;
};

