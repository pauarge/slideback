var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base64Img = require('base64-img');


var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.get('/', (req, res) => {
	res.json('ok');
})

app.post('/image', (req, res) => {
	console.log('got image');
	const b64img = req.body.b64img;
	base64Img.img(b64img, './images', 'test', function(err, filepath) {});
	res.json('ok');
});

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