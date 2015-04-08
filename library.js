var express = require('express');
var library = express();
var server = require('http').createServer(library);
var io = require('socket.io')(server);
var logger = require('morgan');
var bodyParser = require('body-parser');
var model = require('./model');

library.use(logger('dev'));
library.use(express.static(__dirname + '/public'));

library.use(bodyParser.json());
library.use(bodyParser.urlencoded());
//library.use('views', './views');

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
    .then(function(session) {
      res.status(200).json({
        code: 0,
        id: session.id,
        aid: session.aid,
        token: session.token
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

library.use(function(req, res) {
  res.status(500).send('Something broke');
});

server.listen(3000, function() {
  var address = this.address().address;
  var port = this.address().port;
  console.log("Server listening on http://%s:%s...", address, port);
});
