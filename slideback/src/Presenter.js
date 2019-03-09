import React, {Component} from 'react';
import {Document, Page} from 'react-pdf';
import {Button, ButtonToolbar, Alert, ProgressBar, Container, Row, Col} from "react-bootstrap";
import io from "socket.io-client";

import { SOCKET_URL } from './config';


class Presenter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      alertFirst: false,
      alertLast: false,
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(SOCKET_URL, {query: "mode=presenter"});


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


  render() {

  this.socket.on('newScore', function (data) {
    console.log('new score = ', data);
    this.now = data;
  });


    const {pageNumber, numPages} = this.state;
    const now = 60;

    return (
        <Container>
          <Row>

          <Col sm={6}>


            <Document
                file={process.env.PUBLIC_URL + "./Report_hw2_bolon.pdf"}
                onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber}/>
            </Document>
          </Col>
          <Col sm={6}>

            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="button">
              <ButtonToolbar>
                <Button onClick={() => this.prevPage()}>Prev</Button>
                <Button onClick={() => this.nextPage()}>Next</Button>
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

            <p>Page {pageNumber} of {numPages}</p>

            <br></br>


            <p>Satisfaction level</p>
            <ProgressBar now={now} label={`${now}%`} />

          </Col>
          </Row>
        </Container>



    );
  }
}

export default Presenter;
