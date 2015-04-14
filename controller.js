var model = require('./model');

var controller = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {

    // client request a query
    socket.on('query', function(query) {
      model.query(query)
        .then(function(result) {
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
