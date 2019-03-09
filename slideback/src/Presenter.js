import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import {Button, ButtonToolbar, Alert} from "react-bootstrap";

class Presenter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      alertFirst: false,
      alertLast: false,
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  nextPage() {
    if (this.state.pageNumber === this.state.numPages && ! this.state.alertLast){

      this.setState({alertLast: true})
    }
    else if (this.state.pageNumber === this.state.numPages && this.state.alertLast){
      this.setState({alertLast: false, pageNumber: 1})

    }
    else{
      this.setState({pageNumber: this.state.pageNumber + 1, alertLast: false, alertFirst: false})

    }
  };

  prevPage() {
    if (this.state.pageNumber === 1 && ! this.state.alertFirst){
      this.setState({alertFirst: true})
    } else if (this.state.pageNumber === 1 &&  this.state.alertFirst) {
      this.setState({pageNumber: this.state.numPages, alertFirst: false})
    }
    else{
      this.setState({pageNumber: this.state.pageNumber - 1, alertFirst: false, alertLast: false})
    }
  };


  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <div className="button">
          <ButtonToolbar>
            <Button onClick={() => this.nextPage()} as="input" type="button" value=" Next " />
            <Button onClick={() => this.prevPage()} as="input" type="button" value=" Prev " />
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
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
    );
  }
}

export default Presenter;
