var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var checkAuth = require('../common/checkAuth.js');
var upload = require('../common/upload.js');
var Team = require('../models/Team.js');
var formidable = require('formidable');

module.exports = function (app) {
  
  router.get('/', function(req, res) {
  
    Team.list(req, function(cb){
      res.render('team',{teams:cb, user: req.user, page: req.query.page, filter: req.query.filter});  
    });
    
  })  

  router.post('/json', function(req, res) {
    console.log(req.body.team)
    Team.listByName(req.body.team, function(times){
      res.json({team:times});  
    });
    
  })  
  
  router.get('/edit', function(req, res) {
    checkAuth.auth(req,res);  
    res.render('players/edit', { user: req.user });
    
  })

  router.get('/novo', function(req, res) {
        res.render('team/new');  
  })

  router.post('/novo', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

      // checkAuth.auth(req,res);  

      // , owner: req.user.id
      data = {name : fields.name, city : fields.city, uf : fields.uf, email : fields.email, owner : req.user.id};
      Team.save(data, function(id){

        if(files.image.size > 100){
          upload.imagePerfil(files.image, id, function(urlImg){
            if(id){
              Team.image(id, urlImg, function(resultado){
                console.log('Imagem salva')
              });
            }
          });
        }

        res.redirect(''+id);

      });
    })
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

      data = {name : fields.name, team : fields.team, type : fields.type, email : fields.email};
      Players.update(data, req.user.id);
      res.render('players/edit', { user: req.user });
    
    });

  })

  router.get('/:id', function(req, res) {

    Team.find(req.params.id, function(cb){
      if(cb){
        res.render('team/show', {team: cb.team, members: cb.members});  
      }
      else{
        res.send('Usuario não existe.');
      }
    });
    
  })


  return router;
};

