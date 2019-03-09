import React, { Component } from 'react';

import io from 'socket.io-client';
import {Document, Page} from "react-pdf";

import { SOCKET_URL } from './config';
import { Col, Container, ProgressBar, Row} from "react-bootstrap";

import Comments from './Comments'

class Receiver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      pdfURL: null,
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(SOCKET_URL, { query: "mode=receiver" });

    this.socket.on('pageChange', page => {
      console.log('Current page', page);
      this.setState({
        pageNumber: page
      })
    })

    this.socket.on('newDoc', url => {
      this.setState({
        pdfURL: url,
      })
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };



  render() {
    const { pageNumber, numPages } = this.state;

    return (
        <Container>
          <Row>

            <Col sm={7}>


              <Document
                  file={this.state.pdfURL}
                  onLoadSuccess={this.onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </Col>
            <Col sm={5}>

              <br></br>
              <br></br>
              <br></br>
              <br></br>


              <br></br>
              <Comments/>


            </Col>
          </Row>
        </Container>




    )
  }
}

export default Receiver;
