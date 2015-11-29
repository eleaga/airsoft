var express = require('express');
var router = express.Router();
var Teams = require('../models/Team');
var Player = require('../models/Player');
var Video = require('../models/Video');
var bCrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var util = require('util');
var Promise = require('promise');
var LocalStrategy = require('passport-local').Strategy;
var checkAuth = require('../common/checkAuth.js');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		// var users = User.find().exec()
		// console.log(req.isAuthenticated());

		//if user is logedin redirect to home
    	if (req.isAuthenticated()){
		  res.redirect('/home');
    	}

    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		console.log('get');
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/player/edit',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
	    checkAuth.auth(req,res);  
		var players = Player.last(6)
		var teams = Teams.last(4)
		var videos = Video.last(6)

		Promise.all([teams, players, videos]).done(function (results) {	
			res.render('home', { teams: results[0], players: results[1], videos: results[2], user: req.user });
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

	return router;
}





