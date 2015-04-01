var express = require('express');
var library = express();
var server = require('http').createServer(library);
var io = require('socket.io')(server);
var logger = require('morgan');
var model = require('./model');

library.use(logger('dev'));
library.use(express.static(__dirname + '/public'));
//library.use('views', './views');

server.listen(3000, function() {
    var address = this.address().address;
    var port = this.address().port;
    console.log("Server listening on http://%s:%s...", address, port);
});
