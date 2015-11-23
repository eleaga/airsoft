var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/models/User');
var bCrypt = require('bcrypt-nodejs');
var util = require('util');
var https = require('https');


var neo4j = require('neo4j');
var neoDb = new neo4j.GraphDatabase('http://neo4j:root@localhost:7474');


module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){

                var params = {'username': username};

                var query = [
                    'MATCH (n:Players', 
                    '{username:{username}}',
                    ') return n;',
                ].join('\n');

                neoDb.query(query, params, function (err, resp) {

                    if(resp && resp[0]){

                        console.log('Guerreiro! Este nome já está em uso');
                        return done(null, false, req.flash('message','Guerreiro! Este nome já está em uso'));

                    }else{

                        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                        if (success) {
                            var params = {'username': username, password: createHash(password), name: req.body.name};

                            var query = [
                                'CREATE (p:Players ',
                                    '{ username: {username}, password: {password}, name: {name} })',
                                'return p;',
                            ].join('\n');

                            neoDb.query(
                                query, params, function (err, resp) {
                                    if (err){
                                        console.log('-------Error in Saving user: '+err);  
                                        throw err;  
                                    }
                                    console.log(resp[0].p._data.metadata);    
                                    return done(null, resp[0].p._data.metadata);
                                }
                            );

                        } else {
                            return  done(null, false);
                        }
                });

                              
                        }
                    }
                );

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