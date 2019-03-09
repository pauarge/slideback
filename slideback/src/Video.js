import React, { Component } from 'react';

class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoSrc: null
    }

    this.constraints = { audio: false, video: true };

    this.handleVideo = this.handleVideo.bind(this);
  }

  componentDidMount() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia(this.constraints, this.handleVideo, this.videoError);

    }
  }
  handleVideo (stream) {
    // Update the state, triggering the component to re-render with the correct stream
    this.refs.video.src = stream
    console.log(this.refs)

  }

  videoError() {
    console.log("get user media error")
  }

  render() {
    return (
      <div>
        <video src={this.state.videoSrc} id="videoElement" autoPlay="true" ref="video"> </video>
      </div>
    );
  }
}




export default Video;
