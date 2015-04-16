var express = require('express');
var library = express();
var server = require('http').createServer(library);
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var model = require('./model');
var controller = require('./controller');
var credential = require('./credential');

library.use(logger('dev'));
library.use(express.static(__dirname + '/client'));

var sessionStore = new SessionStore(credential.db);

library.use(session({
  key: credential.session.key,
  secret: credential.session.secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

library.use(bodyParser.json());
library.use(bodyParser.urlencoded());

//Routing

library.post('/login', function(req, res, next) {
  if (!req.body) {
    res.sendStatus(403);
    next(new Error("Empty post!"));
  }

  var user = {
    username: req.body.username,
    password: req.body.password
  };

  model.adminLogin(user)
    .then(function(user) {
      var sess = req.session;
      var hour = 3600000;
      sess.username = user.username;
      sess.aid = user.aid;
      sess.cookie.maxAge = hour * 2;
      res.status(200).json({
        code: 0
      });
    })
    .catch(function(err) {
      console.log("Auth error");
      console.log(err.stack);
      res.json({
        code: 1
      });
    });
});

controller(server);

library.use(function(req, res, next) {
  res.status(404).send('Nothing found');
});

library.use(function(err, req, res, next) {
  res.status(500).send('Something broke');
});

server.listen(3000, function() {
  var address = this.address().address;
  var port = this.address().port;
  console.log("Server listening on http://%s:%s...", address, port);
});
