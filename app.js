require('nodetime').profile({
    accountKey: '5109b67ff5ca18b7b0c144faf7afd6a852a59c2b',
    appName: 'Node.js Application'
});

var Entities = require('html-entities').XmlEntities;

var entities = new Entities();

var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

//var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({
    secret: 'iomeansio'
}));
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res) {
    var sess = req.session;
    //Session set when user Request our app via URL
    if (sess.user) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/admin');
    } else {
        res.redirect('login.html');
    }
});

app.post('/login', function(req, res) {
    var sess = req.session;
    //In this we are assigning user to sess.user variable.
    //user comes from HTML page.
    if (req.body.user == "io" && req.body.pass == "pass") {
        sess.user = req.body.user;
        res.end('done');
    } else {
        res.end('ERR_USER_OR_PASS_WRONG');
    }
});

app.get('/admin', function(req, res) {
    sess = req.session;
    if (sess.user == "io") {
        res.write('<h1>Hello ' + sess.user + '</h1>');
        res.end('<a href="/logout">Logout</a>');
    } else {
        res.redirect('/admin_nopass.html');
        //res.write('<h1>Please login first.</h1>');
        //res.end('<a href="/login">Login</a>');
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function(socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function(data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function(username) {
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        if (usernames[username] == username) {
            socket.emit('error in username', {
                reason: 'Nick Already taken'
            });
        } else {
            usernames[username] = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });
            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function() {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function() {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
        // remove the username from global usernames list
        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

app.use('/', routes);
app.use('/users', users);

//var filePath = path.join(__dirname, 'public/WIP.html');
//var filePath1 = path.join(__dirname, 'part1.txt');
//var filePath2 = path.join(__dirname, 'part2.txt');
//var part1 = entities.encode(fs.readFileSync(filePath1));
//var part2 = entities.encode(fs.readFileSync(filePath2));

app.get('/edit', function(req, res) {
    //res.status(200);
    //fs.readFile(filePath, function (err, data) {
    //if (err){ throw err;}
    //    res.render('edit.jade', {title: data});
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, function(err, data) {
        if (!err) {
            console.log('received data: ' + data);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(part1 + data + part2);
            res.end();
        } else {
            console.log(err);
        }

    });
    // });
});

app.post('/edit', function(req, res) {
    var presource = req.body.source;
    var source = entities.decode(presource);
    if (source) {
        fs.writeFile(filePath, source, function(err) {
            if (err) {
                throw err;
            }
        });
    }
    res.send(source);
});

//Handle 418
app.use('/418', function(req, res) {
    res.status(418);
    res.render('418.jade', {
        title: '418: I am a teapot.'
    });
});

// Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('404.jade', {
        title: '404: File Not Found'
    });
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
// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('500.jade', {
        title: '500: Internal Server Error',
        error: error
    });
});

module.exports = app;
