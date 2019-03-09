import React, {Component} from 'react';
import {Document, Page} from 'react-pdf';
import {Button, ButtonToolbar, Alert} from "react-bootstrap";
import io from "socket.io-client";

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
    this.socket = io('http://localhost:4000', {query: "mode=presenter"});
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
    const {pageNumber, numPages} = this.state;

    return (
      <div>
        <div className="button">
          <ButtonToolbar>
            <Button onClick={() => this.nextPage()} as="input" type="button" value=" Next "/>
            <Button onClick={() => this.prevPage()} as="input" type="button" value=" Prev "/>
          </ButtonToolbar>
        </div>

        <Alert show={this.state.alertFirst} variant="info first">
          <Alert.Heading>You are already in the first page of the document</Alert.Heading>
        </Alert>

        <Alert show={this.state.alertLast} variant="info last">
          <Alert.Heading>You are already in the last page of the document</Alert.Heading>
        </Alert>

        <Document
          file={process.env.PUBLIC_URL + "./Report_hw2_bolon.pdf"}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber}/>
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
    );
  }
}

export default Presenter;
