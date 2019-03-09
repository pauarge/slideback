var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log("Query: ", socket.handshake.query);
  	console.log('a user connected');
});

http.listen(4000, function(){
  	console.log('listening on *:4000');
});