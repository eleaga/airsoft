var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');
var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function(passport){

	router.get('/facebook',
	  passport.authenticate('facebook'),
	  function(req, res){
	    // The request will be redirected to Facebook for authentication, so this
	    // function will not be called.
	  });

	router.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/'
		})
	);

	return router;

}