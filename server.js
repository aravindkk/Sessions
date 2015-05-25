var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it

var app = express();

var mongo = require('mongodb');
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;
var Db = mongo.Db;

var server = new Server('localhost',27017, {auto_reconnect:true});
var db = new Db('abcd',server);


db.open(function(err,db)
{
 if(err)
 {
   console.log('Problem with mongodb');
 }
 else
 {
   console.log('Connected to db');
 }
});


var MongoStore = require('connect-mongo')(expressSession);

// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({
  store: new MongoStore({
    db: 'myapp',
    host: '127.0.0.1',
    port: 27017 
  }),
  secret:'somesecrettokenhere'}));

/*app.use(expressSession({secret:'somesecrettokenhere'}));*/

app.use(bodyParser());

var http=require('http');
var server=http.createServer(app);

app.get('/', function(req, res){
  var html = '<form action="/" method="post">' +
             'Your name: <input type="text" name="userName"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>';
  if (req.session.userName) {
    html += '<br>Your username from your session is: ' + req.session.userName;
  }
  res.send(html);
});

app.post('/', function(req, res){
  req.session.userName = req.body.userName;
  res.redirect('/');
});

server.listen(8080);