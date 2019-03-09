import React, { Component } from 'react';

import io from 'socket.io-client';
import {Document, Page} from "react-pdf";

import { SOCKET_URL } from './config';
import {Button, Col, Container, ProgressBar, Row} from "react-bootstrap";

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


  async translate() {

  // Imports the Google Cloud client libraries
  //const vision = require('@google-cloud/vision').v1;

// Creates a client
  //const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
// Bucket where the file resides
  //const bucketName = 'my-bucket';
// Path to PDF file within bucket
  //const fileName = 'public/Report_hw2_bolon.pdf';

  // const gcsSourceUri = `gs://${bucketName}/${fileName}`;
  // const gcsDestinationUri = `gs://${bucketName}/${fileName}.json`;
  //
  // const inputConfig = {
  //   // Supported mime_types are: 'application/pdf' and 'image/tiff'
  //   mimeType: 'application/pdf',
  //   gcsSource: {
  //     uri: gcsSourceUri,
  //   },
  // };
  // const outputConfig = {
  //   gcsDestination: {
  //     uri: gcsDestinationUri,
  //   },
  // };
  // const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
  // const request = {
  //   requests: [
  //     {
  //       inputConfig: inputConfig,
  //       features: features,
  //       outputConfig: outputConfig,
  //     },
  //   ],
  // };
  //
  // const [operation] = await client.asyncBatchAnnotateFiles(request);
  // const [filesResponse] = await operation.promise();
  // const destinationUri =
  //     filesResponse.responses[0].outputConfig.gcsDestination.uri;
  // console.log('Json saved to: ' + destinationUri);
}




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
              <Button onclick={() => this.translate()}>halo</Button>

              <br></br>
              <Comments/>


            </Col>
          </Row>
        </Container>




    )
  }
}

export default Receiver;
