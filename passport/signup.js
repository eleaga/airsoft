var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/models/User');
var bCrypt = require('bcrypt-nodejs');
var util = require('util');
var https = require('https');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
                        console.log('1');

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.find({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(null, false, req.flash('message','Guerreiro! Tenten novamente.'));
                    }
                    // already exists
                    if (user[0]) {
                        console.log('Guerreiro! Este nome já está em uso');
                        return done(null, false, req.flash('message','Guerreiro! Este nome já está em uso'));
                    } else {
                        // if there is no user with that email
                        // create the user

                        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                                if (success) {

                                    var newUser = new User();

                                    // set the user's local credentials
                                    newUser.username = username;
                                    newUser.password = createHash(password);
                                    newUser.name = req.body.name;

                                    // save the user
                                    newUser.save(function(err) {
                                        if (err){
                                            console.log('-------Error in Saving user: '+err);  
                                            throw err;  
                                        }
                                        console.log('User Registration succesful');    
                                        return done(null, newUser);
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