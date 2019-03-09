var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base64Img = require('base64-img');
var request = require ('superagent');


var cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '64mb'}));
app.use(cors());

app.get('/', (req, res) => {
	res.json('ok');
})

app.post('/image', (req, res) => {
	console.log('got image');
	const b64img = req.body.b64img;
	base64Img.img(b64img, './images', 'test', function(err, filepath) {

		var subscriptionKey = "4787f1decd6c451eb365b52b7092151c";

       request
         .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=headPose')
         // putting an actualy url like "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" works
         .send({ "url": "./images/test.jpg" })
         .set('Ocp-Apim-Subscription-Key', subscriptionKey)
         .set('Content-Type', 'application/json')
         .then(res => {
            console.log('SUCCESS!' + JSON.stringify(res.body));
         });

	});
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