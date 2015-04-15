var model = require('./model');

var controller = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {

    // client request a query
    socket.on('query', function(query) {
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
