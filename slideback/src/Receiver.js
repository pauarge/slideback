import React, { Component } from 'react';

import io from 'socket.io-client';

class Receiver extends Component {
  constructor(props) {
    super(props);

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io('http://localhost:4000', { query: "mode=receiver" });
  }

  render() {
    return (
      <p>Hello from receiver</p>
    )
  }
}

export default Receiver;
