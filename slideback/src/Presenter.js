import React, {Component} from 'react';
import {Document, Page} from 'react-pdf';
import {Button, ButtonToolbar, Alert, ProgressBar, Container, Row, Col, InputGroup, FormControl, ButtonGroup} from "react-bootstrap";
import io from "socket.io-client";
import axios from 'axios';

import { SOCKET_URL } from './config';

import Comments from './Comments'


class Presenter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      alertFirst: false,
      alertLast: false,
      success : false,
      url : "",
      pdfURL: null,
      comments: [],
      attentionScore: 100
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(SOCKET_URL, {query: "mode=presenter"});

    this.socket.on('newScore', function (data) {
      console.log('new score = ', data);
      this.setState({
        attentionScore: data
      })
    });

    this.socket.on('newComment', comment => {
      const comments = this.state.comments
      comments.push(comment);
      this.setState({
        textData: '',
        comments
      })
    })
  }

  onDocumentLoadSuccess = ({numPages}) => {
    this.setState({numPages});
  };

  nextPage() {
    let newPageNumber;
    if (this.state.pageNumber === this.state.numPages && !this.state.alertLast) {
      this.setState({alertLast: true});
    } else if (this.state.pageNumber === this.state.numPages && this.state.alertLast) {
      newPageNumber = 1;
      this.setState({alertLast: false});
    } else {
      newPageNumber = this.state.pageNumber + 1;
      this.setState({alertLast: false, alertFirst: false})
    }

    if (newPageNumber) {
      this.setState({
        pageNumber: newPageNumber
      }, () => this.socket.emit('pageChange', this.state.pageNumber))
    }
  };

  prevPage() {
    let newPageNumber;
    if (this.state.pageNumber === 1 && !this.state.alertFirst) {
      this.setState({alertFirst: true})
    } else if (this.state.pageNumber === 1 && this.state.alertFirst) {
      newPageNumber = this.state.numPages;
      this.setState({alertFirst: false})
    } else {
      newPageNumber = this.state.pageNumber - 1;
      this.setState({alertFirst: false, alertLast: false})
    }

    if (newPageNumber) {
      this.setState({
        pageNumber: newPageNumber
      }, () => this.socket.emit('pageChange', this.state.pageNumber))
    }
  };

  handleChange = (ev) => {
    this.setState({success: false, url : ""});

  }

  submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);

    axios.post(`${SOCKET_URL}/test-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data);
      this.setState({
        pdfURL: response.data.Location,
      })
      this.socket.emit('newDoc', response.data.Location);
      // handle your response;
    }).catch(error => {
      console.log(error);
      // handle your error
    });
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  render() {
    const {pageNumber, numPages} = this.state;
    const now = this.state.attentionScore;

    return (
        <Container>
          <Row>

          <Col sm={7}>


            <Document
                file={this.state.pdfURL}
                onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber}/>
            </Document>
          </Col>
          <Col sm={5}>

            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="button">
              <ButtonToolbar>
                <ButtonGroup className="mr-4">
                  <Button onClick={() => this.prevPage()}>Prev</Button>
                </ButtonGroup>
                <ButtonGroup className="mr-4">
                  <Button onClick={() => this.nextPage()}>Next</Button>
                </ButtonGroup>
                <p>Page {pageNumber} of {numPages}</p>
              </ButtonToolbar>
            </div>

            <br></br>


            {this.state.alertFirst ?
                (<Alert defaultShow={this.state.alertFirst} variant="info first">
                  <Alert.Heading>You are already in the first page of the document</Alert.Heading>
                  <p>To continue click of 'Prev'</p>
                </Alert>) : ''
            }


            {this.state.alertLast ?
                (<Alert variant="info last">
                  <Alert.Heading>You are already in the last page of the document</Alert.Heading>
                  <p>To continue click of 'Next'</p>
                </Alert>) : ''
            }

            <br></br>

            <div className="Satisfaction bar">
              <Row>
                <Col sm={4}>
                  <p>Satisfaction level: </p>
                </Col>
                <Col sm={8}>
                  <ProgressBar now={this.state.pageNumber * this.state.numPages} label={`${this.state.pageNumber * this.state.numPages}%`} />
                </Col>
              </Row>
            </div>


            <br></br>

            <div className="upload-document">
              <p>Upload your new presentation: </p>
              <form onSubmit={this.submitFile}>
            <div className="input-group">
              <div className="input-group-prepend">
                <button className="input-group-text" id="inputGroupFileAddon01">Upload</button>
              </div>
              <div className="custom-file">
                <input
                    type="file"
                    className="custom-file-input"
                    id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                    onChange={this.handleFileUpload}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose file
                </label>
              </div>
            </div>
              </form>
            </div>

            <div>
              <div className="doubts">
                {this.state.comments.map(comment => {
                  return <p>{comment}</p>
                })}
              </div>
            </div>

          </Col>
          </Row>
        </Container>



    );
  }
}

export default Presenter;
