var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.json('ok');
})

io.on('connection', function(socket){
	console.log("Query: ", socket.handshake.query);
  	console.log('a user connected');

  	socket.on('pageChange', page => {
  		console.log('pageChange');
  		socket.broadcast.emit('pageChange', page);
  	})
});

http.listen(8081, function(){
  	console.log('listening on *:8081');
});