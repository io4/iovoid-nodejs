var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
<<<<<<< HEAD
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email = require('nodejs');

//begin of paswordless setup

var smtpServer  = email.server.connect({
   user:    fiegllucas@gmail.com, 
   password: Electronica, 
   host:    smtp.gmail.com, 
   ssl:     true
});

 
var mongoURI = 'mongodb://admin:admin@ds041831.mongolab.com:41831/nodejs';
passwordless.init(new MongoStore(mongoURI));

passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'iovoid.tk/auth';
        smtpServer.send({
            text:    'Hello!\nAccess your account here: https://' 
            + host + '?token=' + tokenToSend + '&uid=' 
            + encodeURIComponent(uidToSend), 
            from:    yourEmail, 
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
});

//end of passwordless setup
=======
>>>>>>> parent of 7d4767f... Add beta auth sys

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)

})

module.exports = app;
