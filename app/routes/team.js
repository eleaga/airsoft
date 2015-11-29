var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var checkAuth = require('../common/checkAuth.js');
var upload = require('../common/upload.js');
var owner = require('../common/owner.js');
var Team = require('../models/Team.js');
var formidable = require('formidable');

module.exports = function (app) {
  
  router.get('/', function(req, res) {
  
    Team.list(req, function(cb){
      res.render('team',{teams:cb, user: req.user, page: req.query.page, filter: req.query.filter});  
    });
    
  })  

  router.post('/json', function(req, res) {
    Team.listByName(req.body.team, function(times){
      res.json({team:times});  
    });
    
  })  
  
  router.get('/edit/:id', function(req, res) {
    checkAuth.auth(req,res);

    Team.find(req.params.id, function(cb){
      if(cb){
        res.render('team/edit', { user: req.user, team: cb.team });
      }
      else{
        res.send('Usuario não existe.');
      }
    });

  })

  router.post('/edit/:id', function(req, res) {
    checkAuth.auth(req,res);  

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

      if(files.image.size > 100){
        upload.imagePerfil(files.image, req.user.id, function(cb){
          if(cb){
            Team.image(req.params.id, cb, function(resultado){
              console.log('Imagem salva')
            });
          }else{
            res.send('Falha no formulario');
          }
        });
      }

      Team.update(fields, req.params.id, req.user.id).then(function(result){
        res.render('/home', { user: req.user }); 
      }, function (error) {
          res.status('401').send(error);
      });
    
    });

  })

  router.get('/delete/:id', function(req, res) {
    checkAuth.auth(req,res);  
    Team.remove(req.user.id, req.params.id, function(result){
      res.redirect('/home');
    })

  })

  router.get('/novo', function(req, res) {
    checkAuth.auth(req,res);  
    res.render('team/new');  
  })

  router.post('/novo', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

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

  router.get('/:id', function(req, res) {

    Team.find(req.params.id, function(cb){
      if(cb){
        userIsOwner = owner.isOwnerTeam(req, cb.team.owner._id);
        res.render('team/show', {team: cb.team, members: cb.members, user: req.user, userIsOwner: userIsOwner});  
      }
      else{
        res.send('Usuario não existe.');
      }
    });
    
  })


  return router;
};

