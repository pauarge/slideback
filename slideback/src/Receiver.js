import React, { Component } from 'react';

import io from 'socket.io-client';
import {Document, Page} from "react-pdf";

import { SOCKET_URL } from './config';
import {Button, Col, Container, Form, ProgressBar, Row} from "react-bootstrap";

class Receiver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      pdfURL: null,
      comments: []
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


  handleChange(event) {
    this.setState({
      textData: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const comments = this.state.comments;
    comments.push(this.state.textData);
    this.setState({
      textData: '',
      comments
    })
    this.socket.emit('newComment', this.state.textData);
  }

  render() {
    const { pageNumber, numPages } = this.state;

    return (
        <Container fluid={true}>
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

              <div>
                <Form onSubmit={e => this.handleSubmit(e)}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Doubts</Form.Label>
                    <Form.Control type="text" placeholder="Submit your doubts" value={this.state.textData}
                                  onChange={e => this.handleChange(e)}/>
                  </Form.Group>
                  <Button type="submit">Submit form</Button>

                </Form>

                <br></br>

                <div className="comment">
                  {this.state.comments.map(comment => {
                    return <p>{comment}</p>
                  })}
                </div>
              </div>


            </Col>
          </Row>
        </Container>

    )
  }
}

export default Receiver;
