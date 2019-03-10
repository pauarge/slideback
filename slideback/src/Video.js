import React, { Component } from 'react';
import Webcam from 'react-webcam';
import request from 'superagent';

import { Button } from 'react-bootstrap';


class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageData: null,
      intervalID: null,
      analysisUrl: null,
    };

    this.id = this.makeid();
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    if (this.webcam) {
      const imageSrc = this.webcam.getScreenshot();
      this.setState({
        imageData: imageSrc,
      });
      request
        .post('http://localhost:8081/image')
        .send({ b64img: imageSrc, id: this.id })
        .set('Content-Type', 'application/json')
        .then((res) => {
          console.log(res);
        });
      // this.processImage()
    }
  };

  processImage() {
    const subscriptionKey = '4787f1decd6c451eb365b52b7092151c';

    this.setState({
      analysisUrl: this.refs.currentImage,
    });

    request
      .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=headPose')
      // putting an actualy url like "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" works
      .send({ url: 'https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg' })
      .set('Ocp-Apim-Subscription-Key', subscriptionKey)
      .set('Content-Type', 'application/json')
      .then((res) => {
        alert(`yay got ${JSON.stringify(res.body)}`);
      });
  }


  componentDidMount() {
    this.setState({
      intervalID: setInterval(
          () => this.capture(),
          10000,
      )
    });
  }


  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user',
    };

    const stl = {
      display: 'none',
    };


    return (
      <div>
        <Webcam
          videoConstraints={videoConstraints}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          audio={false}
        />

        {this.state.imageData
          ? (
            <p>
              <img alt="currentImg" ref="currentImage" src={this.state.imageData} style={stl}/>
            </p>
          )
          : null}

      </div>

    );
  }
}

export default Video;
