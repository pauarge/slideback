import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import io from 'socket.io-client';
import { Document, Page } from 'react-pdf';

import {
  Button, ButtonGroup, Col, Container, DropdownButton, Form, Dropdown, Row,
} from 'react-bootstrap';
import { SOCKET_URL } from './config';

import Video from './Video';

class Receiver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPages: 'en',
      pageNumber: 1,
      pdfURL: null,
      comments: [],
      toLan: 'en',
      translated: '',
      toTranslate: [],
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(SOCKET_URL, { query: 'mode=receiver' });

    this.socket.on('pageChange', (page) => {
      console.log('Current page', page);
      this.setState({
        pageNumber: page,
      }, () => {
        if (this.state.toLan !== 'en') {
          this.translate(this.state.toLan);
        }
      });
    });

    this.socket.on('newDoc', (url) => {
      this.setState({
        pdfURL: url,
      });
    });

    this.socket.on('translation', (text) => {
      this.setState({ translated: text.split('\f') });
    });


    this.socket.on('newText', (data) => {
      const parsed = JSON.parse(data);
      this.setState({
        toTranslate: parsed,
      });
    });
  }

    onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({ numPages });
    };


    handleChange(event) {
      this.setState({
        textData: event.target.value,
      });
    }

    handleSubmit(event) {
      event.preventDefault();
      const comments = this.state.comments;
      comments.push(this.state.textData);
      this.setState({
        textData: '',
        comments,
      });
      this.socket.emit('newComment', this.state.textData);
    }

    translate(language) {
      this.setState({ toLan: language });

      fetch(`${SOCKET_URL}/translate`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({
          text: this.state.toTranslate[this.state.pageNumber - 1],
          lang: language,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(resp => resp.json())
        .then(dat => this.setState({ translated: dat.text }));


      console.log(this.state.translated.slice(this.state.pageNumber - 1, this.state.pageNumber));
    }

    render() {
      const { pageNumber } = this.state;

      return (
        <Container fluid>
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

              <div>
                <Form onSubmit={e => this.handleSubmit(e)}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <h5>Doubts</h5>

                      <Form.Control
                          type="text" placeholder="Submit your doubts"
                          value={this.state.textData}
                          onChange={e => this.handleChange(e)}
                      />

                  </Form.Group>
                  <Button type="submit">Submit question</Button>

                </Form>

                <br />

              <Scrollbars style={{ width: 500, height: 200 }}>
                <div className="comment">
                  {this.state.comments.reverse().map(comment => <p>{comment}</p>)}
                </div>
              </Scrollbars>
              </div>

              <div className="Translator">
                <Row>
                  <Col sm={4}>
                    <DropdownButton
                      as={ButtonGroup}
                      title="Select Language"
                      id="bg-nested-dropdown"
                      onSelect={eventKey => this.translate(eventKey)}
                    >
                      <Dropdown.Item eventKey="de">German</Dropdown.Item>
                      <Dropdown.Item eventKey="fr-ch"> French</Dropdown.Item>
                      <Dropdown.Item eventKey="it"> Italian</Dropdown.Item>
                      <Dropdown.Item eventKey="es"> Spanish</Dropdown.Item>
                      <Dropdown.Item eventKey="ja"> Japanese</Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
              </div>

              <div>
                <p>{this.state.translated}</p>
              </div>

              <Video />
            </Col>
          </Row>
        </Container>

      );
    }
}

export default Receiver;
