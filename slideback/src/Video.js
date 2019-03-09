import React from "react";
import Webcam from "react-webcam";

class Video extends React.Component {

  state = {
    imageData: null,
    imageName: "",
    imageSave: false
  }

  intervalID = null

  setRef = (webcam) => {
    this.webcam = webcam;
  }  

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    })
  };


  componentDidMount() {
    this.intervalID = setInterval(
      () => this.capture(),
      1000
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
          <img src={this.state.imageData}/>
        </p>
        : null}

      </div>

      ) ;
  }
}

export default Video;
