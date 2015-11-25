var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var util = require('util');
var https = require('https');

var User = require('../app/models/UserNeo4');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){

                User.get(username, function (results) {
                    // already exists
                    console.log(results);
                    if (results.length) {
                        console.log('Guerreiro! Este nome já está em uso');
                        return done(null, false, req.flash('message','Guerreiro! Este nome já está em uso'));
                    } else {
                        // if there is no user with that email
                        // create the user

                        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                            if (success) {

                                // set the user's local credentials
                                var params = {username: username, password: createHash(password), name: req.body.name};

                                User.create( params, function (resp) {
                                    // console.log(resp);    
                                    return done(null, resp);
                                });

                            } else {
                                return  done(null, false);
                            }
                        });
                    }

                });

            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    function verifyRecaptcha(key, callback) {
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=6Lfzdw8TAAAAACX0HdcOFfR6LIKvR2mEW2lHD97K&response=" + key, function(res) {
            var data = "";
            res.on('data', function (chunk) {
                            data += chunk.toString();
            });
            res.on('end', function() {
                try {
                    var parsedData = JSON.parse(data);
                    console.log(parsedData);
                    callback(parsedData.success);
                } catch (e) {
                    console.log('Captcha é obrigatório.');
                    return done(null, false, req.flash('message','Captcha é obrigatório.'));
                    callback(false);
                }
            });
        });
    }


}