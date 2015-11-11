var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/User');

var FACEBOOK_APP_ID = "601513546621583"
var FACEBOOK_APP_SECRET = "543f70f11252d601a5edbd67259a7e73";

module.exports = function(passport){
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      enableProof: false
    },

       // facebook will send back the tokens and profile
      function(access_token, refresh_token, profile, done) {

        console.log('profile', profile);

      // asynchronous
      process.nextTick(function() {

        // find the user in the database based on their facebook id
            User.findOne({ 'username' : profile.id }, function(err, user) {

              // if there is an error, stop everything and return that
              // ie an error connecting to the database
                if (err)
                    return done(err);

          // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    console.log(profile);
            // set all of the facebook information in our user model
                    newUser.username    = profile.id; // set the users facebook id                 
                    newUser.access_token = access_token; // we will save the token that facebook provides to the user                  
                    newUser.name = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.picture = 'https://graph.facebook.com/'+profile.id+'/picture?width=400&height=400';
            // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
          });

      }));
}