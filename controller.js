var model = require('./model');

var controller = function(server, sessionMiddleware) {
  var io = require('socket.io')(server);

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on('connection', function(socket) {

    // client request a query
    socket.on('query', function(query) {
      // reset query.data.aid
      if (query.data && query.data.aid) query.data.aid = null;
      if (socket.request.session && socket.request.session.aid) {
        query.data.aid = socket.request.session.aid;
      }
      model.query(query)
        .then(function(data) {
          var result = {};
          result.action = query.action;
          result.data = data;
          socket.emit('query', result);
        })
        .catch(function(err) {
          console.log("query failed!");
          console.error(err.stack);
          socket.emit('error');
        });
    });

  });
};

module.exports = controller;
