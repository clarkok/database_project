var model = require('./model');

function verifyCookie(socket, next) {
  var session = {};
  session.id = socket.request.headers.cookie.id;
  session.token = socket.request.headers.cookie.token;
  var result = model.findSession(session)
    .then(function(check) {
      if (check) {
        return true;
      } else {
        next(new Error('Session auth error'));
      }
    })
    .catch(function(err) {
      next(new Error('Database busy'));
      console.log("Session auth failed");
      console.error(err.stack);
    });
  if (result) {
    next();
  }
}

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

    // client request borrow a book
    socket.on('borrow', function(borrow) {
      model.borrow(borrow)
        .then(function(result) {
          socket.emit('borrow', result);
        })
        .catch(function(err) {
          console.log("borrow failed!");
          console.error(err.stack);
          socket.emit('error');
        });
    });

    // client request return a book
    socket.on('return', function(data) {
      model.returnBook(data)
        .then(function(result) {
          socket.emit('return', result);
        })
        .catch(function(err) {
          console.log("return book failed!");
          console.error(err.stack);
          socket.emit('error');
        });
    });

    // client request list_card
    socket.on('list_card', function(data) {
      model.listCard(data)
        .then(function(result) {
          socket.emit('list_card', result);
        })
        .catch(function(err) {
          console.log("list card failed!");
          console.error(err.stack);
          socket.emit('error');
        });
    });


    // TODO: new_card, delete_card, new_book, new_books, delete_books
  });
};

module.exports = controller;
