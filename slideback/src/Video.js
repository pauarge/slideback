import React from "react";
import Webcam from "react-webcam";
import request from 'superagent';
import base64Img from 'base64-img';




class Video extends React.Component {

  state = {
    imageData: null,
    intervalID: null,
    analysisUrl: null,
  }

  

  setRef = (webcam) => {
    this.webcam = webcam;
  }  

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    })
    base64Img.img(this.state.imageData, './', 'test', function(err, filepath) {});
    // this.processImage()
  };


  processImage() {
        const subscriptionKey = "4787f1decd6c451eb365b52b7092151c";

        this.setState({
          analysisUrl: this.refs.currentImage,
        })

       request
         .post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=headPose')
         // putting an actualy url like "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" works
         .send({ "url": "https://www.thoughtco.com/thmb/08sd14jZzhDl5nX4Qy0xqj82nUc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-141090015-5ad4786efa6bcc0036b494de.jpg" })
         .set('Ocp-Apim-Subscription-Key', subscriptionKey)
         .set('Content-Type', 'application/json')
         .then(res => {
            alert('yay got ' + JSON.stringify(res.body));
         });

}




  componentDidMount() {
    this.state.intervalID = setInterval(
      () => this.capture(),
      10000
    );

  }


  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };


    return(
      <div>
      <Webcam 
        videoConstraints = {videoConstraints}
        ref = {this.setRef}
        screenshotFormat="image/jpeg"
        audio={false}
      />

      <div className="button-container" >
        <button onClick={this.capture}> capture </button>
      </div>

      {this.state.imageData? 
        <p>
          <img ref="currentImage" src={this.state.imageData}/>
        </p>
        : null}

      </div>

      ) ;
  }
}

export default Video;
