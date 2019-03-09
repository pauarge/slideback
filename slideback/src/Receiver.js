import React, { Component } from 'react';

import io from 'socket.io-client';
import {Document, Page} from "react-pdf";

class Receiver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io('http://localhost:4000', { query: "mode=receiver" });

    this.socket.on('pageChange', page => {
      console.log('Current page', page);
      this.setState({
        pageNumber: page
      })
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <Document
        file={process.env.PUBLIC_URL + "./Report_hw2_bolon.pdf"}
        onLoadSuccess={this.onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    )
  }
}

export default Receiver;
