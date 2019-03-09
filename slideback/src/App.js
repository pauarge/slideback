import React, {Component} from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import './App.css';

import Presenter from './Presenter';
import Receiver from './Receiver';
import Video from './Video';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPresenter: false,
      displayReceiver: false,
      displayVideo: true,
    };
  }

  changePage(page) {
    if (page === 'presenter') {
      this.setState({
        displayPresenter: true,
        displayReceiver: false,
        displayVideo: false,
      });
    } else if (page === 'receiver') {
      this.setState({
        displayPresenter: false,
        displayReceiver: true,
        displayVideo: false,
      });
    } else {
      this.setState({
        displayPresenter: false,
        displayReceiver: false,
        displayVideo: true,
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
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link eventKey={1} onClick={() => this.changePage('presenter')}>Presenter</Nav.Link>
                <Nav.Link eventKey={2} onClick={() => this.changePage('receiver')}>Receiver</Nav.Link>
                <Nav.Link eventKey={3} onClick={() => this.changePage('video')}>Video</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>


        <div className="content">
          <Container>
            {this.state.displayPresenter && <Presenter/>}
            {this.state.displayReceiver && <Receiver/>}
            {this.state.displayVideo && <Video/>}
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
