var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base64Img = require('base64-img');
var request = require('superagent');


const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

var students = [];
var presenter = null;

var cors = require('cors');
var bodyParser = require('body-parser');
var aws = require('aws-sdk');

app.use(bodyParser.json({limit: '64mb'}));
app.use(cors());


// require('dotenv').config(); // Configure dotenv to load in the .env file

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'eu-central-1', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

aws.config.setPromisesDependency(bluebird);

const s3 = new aws.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'slideback-bucket',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

app.get('/', (req, res) => {
  res.json('ok');
})

app.post('/image', (req, res) => {
  console.log('got image');
  const b64img = req.body.b64img;
  base64Img.img(b64img, './images', 'test', function (err, filepath) {

    var subscriptionKey = "4787f1decd6c451eb365b52b7092151c";

       request
         .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=headPose')
         // putting an actualy url like "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" works
         .send({ "url": "http://sourabhs.space/test.jpg" })
         .set('Ocp-Apim-Subscription-Key', subscriptionKey)
         .set('Content-Type', 'application/json')
         .then(res => {
            console.log('SUCCESS!' + JSON.stringify(res.body));
            computeNewScores(5);

         });
    request
      .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=headPose')
      // putting an actualy url like "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" works
      .send({"url": "http://sourabhs.space/test.jpg"})
      .set('Ocp-Apim-Subscription-Key', subscriptionKey)
      .set('Content-Type', 'application/json')
      .then(res => {
        console.log('SUCCESS!' + JSON.stringify(res.body));
      });

  });
  res.json('ok');
});

app.post('/test-upload', (request, response) => {
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return response.status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error);
    }
  });
});

io.on('connection', function (socket) {
  console.log("Query: ", socket.handshake.query);
  console.log('a user connected');

  socket.on('pageChange', page => {
    console.log('pageChange');
    socket.broadcast.emit('pageChange', page);
  })

  socket.on('newDoc', url => {
    socket.broadcast.emit('newDoc', url);
  })
});


function computeNewScores(list_of_scores) {
  //do computation
  var new_scores = list_ofscores+1
  if (new_scores != list_ofscores){
      presenter.emit('newScore', new_scores)
  }
}


// io.on('connection', function(socket){
// 	console.log("Query: ", socket.handshake.query);
// 	if (socket.handshake.query.mode == "presenter") {
//         presenter = socket;
//         console.log('presenter connected');
//     }
//     else{
//     	students.push(socket);
//     	console.log('a student connected');
//     }
//
//   	socket.on('pageChange', page => {
//   		console.log('pageChange');
//   		socket.broadcast.emit('pageChange', page);
//   	})
// });

http.listen(8081, function () {
  console.log('listening on *:8081');
});
