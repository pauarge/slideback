const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const base64Img = require('base64-img');
const request = require('superagent');

const extract = require('pdf-text-extract');

const fetch = require('node-fetch');

const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const metrics = {};

const presenter = null;

const cors = require('cors');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

const blackList = ['idiot', 'fuck', 'dumb', 'shit'];

app.use(cors());
app.use(bodyParser.json({ limit: '64mb' }));


require('dotenv').config(); // Configure dotenv to load in the .env file

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'eu-central-1', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

aws.config.setPromisesDependency(bluebird);

const s3 = new aws.S3();


function StandardDeviation(numbersArr) {
    //--CALCULATE AVAREGE--
    var total = 0;
    for(var key in numbersArr) 
       total += numbersArr[key];
    var meanVal = total / numbersArr.length;
    //--CALCULATE AVAREGE--
  
    //--CALCULATE STANDARD DEVIATION--
    var max = Math.max.apply(Math,numbersArr);
    var min = Math.min.apply(Math,numbersArr);
    if (max-meanVal>meanVal-min){
    	return max-meanVal;
    }
    else{
    	return meanVal-min;
    }
}

function computeNewScores(id, new_data) {
    // do computation
    let index = 0;
    let data = JSON.parse(new_data);
/** Reference to API response JSON
{
  "faceId": "9be72f6f-06ae-41db-a2b0-1187b6f71751",
  "faceRectangle": {
    "top": 265,
    "left": 507,
    "width": 61,
    "height": 61
  },
  "faceAttributes": {
    "smile": 0.014,
    "headPose": {
      "pitch": 0.0,
      "roll": -10.5,
      "yaw": -6.3
    },
    "emotion": {
      "anger": 0.0,
      "contempt": 0.0,
      "disgust": 0.0,
      "fear": 0.0,
      "happiness": 0.014,
      "neutral": 0.985,
      "sadness": 0.0,
      "surprise": 0.0
    }
  }
* */

    if (!(id in metrics)){
  		metrics[id] = {
  			"headPose":{
  				"roll": [],
  				"yaw": [],
  			},
  			"smile":[],
  			"emotion":{
  				"anger":[],
  				"contempt":[],
  				"disgust":[],
  				"fear":[],
  				"happiness":[],
  				"neutral":[],
  				"sadness":[],
  				"surprise":[],
  			}
  		}
	}
	
	if (data[0]["faceAttributes"] == null){
		metrics[id]["headPose"]["yaw"].push(25);
		metrics[id]["headPose"]["yaw"].push(-25);
	}
	else{
		metrics[id]["headPose"]["yaw"].push(data[0]["faceAttributes"]["headPose"]["yaw"]);
		metrics[id]["headPose"]["roll"].push(data[0]["faceAttributes"]["headPose"]["roll"]);

	   	metrics[id]["emotion"]["anger"].push(data[0]["faceAttributes"]["emotion"]["anger"]);
	   	metrics[id]["emotion"]["contempt"].push(data[0]["faceAttributes"]["emotion"]["contempt"]);
	   	metrics[id]["emotion"]["disgust"].push(data[0]["faceAttributes"]["emotion"]["disgust"]);
	   	metrics[id]["emotion"]["fear"].push(data[0]["faceAttributes"]["emotion"]["fear"]);
	   	metrics[id]["emotion"]["happiness"].push(data[0]["faceAttributes"]["emotion"]["happiness"]);
	   	metrics[id]["emotion"]["neutral"].push(data[0]["faceAttributes"]["emotion"]["neutral"]);
	   	metrics[id]["emotion"]["sadness"].push(data[0]["faceAttributes"]["emotion"]["sadness"]);
	   	metrics[id]["emotion"]["surprise"].push(data[0]["faceAttributes"]["emotion"]["surprise"]); 

	   	metrics[id]["smile"].push(data[0]["faceAttributes"]["smile"]);
	}


   	while (metrics[id]["headPose"]["yaw"].length > 10){
   		metrics[id]["headPose"]["yaw"].shift();
   	}

  console.log(metrics[id]["headPose"]["yaw"])
  console.log(StandardDeviation(metrics[id]["headPose"]["yaw"]))

  const attention_score = StandardDeviation(metrics[id]["headPose"]["yaw"]);
  const emotion_score = Math.random() * 100;

  // TODO:
  // average on all users -> attention_score = variance of last 10 ["faceAttributes"]["headPose"]["yaw"] --> high variance = bad
  // average on all users -> emotion_score = neutral + happiness +surprise - fear - anger

  io.emit('newScore', JSON.stringify({
    attention_score,
    emotion_score,
  }));
}

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'slideback-bucket',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params).promise();
};

app.get('/', (req, res) => {
  res.json('ok');
});

app.post('/image', (req, res) => {
  console.log('got image');
  const { b64img, id } = req.body;
  base64Img.img(b64img, './images', 'test', async (err, filepath) => {
    const subscriptionKey = '4787f1decd6c451eb365b52b7092151c';

    const buffer = fs.readFileSync('./images/test.jpg');
    const type = fileType(buffer);
    const timestamp = Date.now().toString();
    const fileName = `webcam/test${timestamp}`;
    console.log(fileName)
    await uploadFile(buffer, fileName, type)
    	.then(()=> {
		    request
		      .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=headPose,emotion,smile')
		      // .send({ url: 'https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg' })
		      .send({ url: `https://s3.eu-central-1.amazonaws.com/slideback-bucket/${fileName}.jpg` })
		      .set('Ocp-Apim-Subscription-Key', subscriptionKey)
		      .set('Content-Type', 'application/json')
		      .then((resp) => {
		        // console.log(`SUCCESS!${JSON.stringify(resp.body)}`);
		        computeNewScores(id, JSON.stringify(resp.body));
		      });
    	});
  });
  res.json('ok');
});

app.post('/upload', (request, response) => {
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const { path } = files.file[0];

      extract(path, (err, pages) => {
        if (err) {
          console.dir(err);
          return;
        }
        io.emit('newText', JSON.stringify(pages));
      });

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


app.post('/translate', (request, response) => {
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${request.body.lang}`;

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'b69042f258414c4a9974fbea3cc3f375',
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify([{ Text: request.body.text }]),
  })
    .then(resp => resp.json())
    .then((jdata) => {
      response.json({ text: jdata[0].translations[0].text });
      // console.log(jdata[0].translations[0].text)
    });
});


io.on('connection', (socket) => {
  console.log('Query: ', socket.handshake.query);
  console.log('a user connected');

  socket.on('pageChange', (page) => {
    console.log('pageChange');
    socket.broadcast.emit('pageChange', page);
  });

  socket.on('newDoc', (url) => {
    socket.broadcast.emit('newDoc', url);
  });

  socket.on('newComment', (comment) => {
    for (let i = 0; i < blackList.length; i++)
      if (comment.includes(blackList[i]))
        comment = 'Harmful comment removed';
    socket.broadcast.emit('newCommentServer', comment);
  });
});




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
// });

http.listen(8081, () => {
  console.log('listening on *:8081');
});
