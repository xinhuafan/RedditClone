// imported packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
// routers
var routes = require('./routes/index');
var users = require('./routes/users');
var postdetail = require('./routes/postdetail');
var usermanage = require('./routes/usermanage');
var ajax = require('./routes/ajax'); 
var Login = require('./routes/Login'); 
//authencation


//express init
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware setting
//configuration
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Reddit Clone Project'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

//Auth


//print session information


//routers
app.use('/', routes);
app.use('/users', users);
app.use('/post', postdetail);
app.use('/usermanage', usermanage);
app.use('/ajax', ajax);
app.use('/Login', Login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    
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

var server =app.listen(1991, function(){
    var hostname = server.address().address
    var port = server.address().port 
  console.log(' Server running at'+ port);
});


module.exports = app;