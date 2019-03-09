import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';

import Presenter from './Presenter';
import Receiver from './Receiver';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPresenter: true,
      displayReceiver: false,
    };
  }

  changePage(page) {
    if (page === 'presenter') {
      this.setState({
        displayPresenter: true,
        displayReceiver: false,
      });
    } else if (page === 'receiver') {
      this.setState({
        displayPresenter: false,
        displayReceiver: true,
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="navbar">

          <Navbar fixed="top" bg="light" expand="lg">
            <Navbar.Brand href="#home">SlideBack</Navbar.Brand>
            <Navbar.Text> </Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link eventKey={1} onClick={() => this.changePage('presenter')}>Presenter</Nav.Link>
                <Nav.Link eventKey={2} onClick={() => this.changePage('receiver')}>Receiver</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>


        <div className="content">
          <Container fluid>
            {this.state.displayPresenter && <Presenter />}
            {this.state.displayReceiver && <Receiver />}
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
