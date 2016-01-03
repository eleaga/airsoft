var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');
var formidable = require('formidable');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy;

mongoose.connect('mongodb://'+process.env.HOST+'/'+process.env.DB);
console.log('mongodb://'+process.env.HOST+'/'+process.env.DB);
var app = express();
// Configuring Passport
// TODO - Why Do we need this key ?

app.use(session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


require('./passport/facebook.js')(passport);


//MODELS
var User = require('./app/models/User');
var Team = require('./app/models/Team');

//ROUTES
var routes = require('./app/routes/index')(passport);
var auth = require('./app/routes/auth')(passport);
var player = require('./app/routes/player')(passport);
var vote = require('./app/routes/vote')(passport);
var team = require('./app/routes/team')(passport);
var video = require('./app/routes/video')(passport);
// var users = require('./app/routes/users');

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ 
  keepExtensions: true,
  limit: 1024 * 1024 * 1,
  defer: true     
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);
app.use('/player', player);
app.use('/vote', vote);
app.use('/team', team);
app.use('/video', video);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'dev') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
