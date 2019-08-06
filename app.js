var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var MongoClient = require('mongodb').MongoClient;
var utils = require("util");
var http = require("http");
var fs = require("fs");

var httpsPort = 8080;

/*var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/k-developer.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/k-developer.com/cert.pem')
};
*/

//var secureServer = http.createServer(app).listen(httpsPort);

var index = require('./routes/index');
var sheets = require('./routes/sheets');
var games = require('./routes/games');


var app = express();

var server = http.createServer(app);
server.listen(httpsPort);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', 80);
app.set('port_https', 3443);


MongoClient.connect("mongodb://localhost:27017/gurps", {native_parser:true}, function(err, database) {
    if(err) return console.error(err);
    global.db = database.db("gurps");
    console.log("connected to "+db.s.databaseName);
  });


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), {dotfiles: 'allow'} ));

app.use('/', index);
app.use('/sheets', sheets);
app.use('/game', games);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
