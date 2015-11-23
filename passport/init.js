var login = require('./login');
var signup = require('./signup');
var User = require('../app/models/User');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        // console.log('serializing user: ');console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
        //     // console.log('deserializing user:',user);
        //     done(err, user);
        // });
        var params = {'id': id};

        var query = [
            'MATCH (s) WHERE ID(s) = {id} RETURN s;',
        ].join('\n');

        neoDb.query(query, params, function (err, resp) {
            player = resp[0].s._data.data;
            player.metadata = resp[0].s._data.metadata
            // console.log(player);
            done(err, resp);
        });      
        // User.findById(id, function(err, user) {
        //     // console.log('deserializing user:',user);
        //     done(err, user);
        // });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}