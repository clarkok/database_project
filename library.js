var express = require('express');
var library = express();
var server = require('http').createServer(library);
var logger = require('morgan');
var bodyParser = require('body-parser');
var model = require('./model');
var controller = require('./controller');

library.use(logger('dev'));
library.use(express.static(__dirname + '/client'));

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
