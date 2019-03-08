import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';

class Presenter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };


  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
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
