import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './App.css';

import Presenter from './Presenter';
import Receiver from './Receiver';
import Video from './Video';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPresenter: true,
      displayReceiver: false,
      displayVideo: false,
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
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand >LauzHack Live</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={() => this.changePage('presenter')}>Presenter</NavItem>
              <NavItem eventKey={2} onClick={() => this.changePage('receiver')}>Receiver</NavItem>
              <NavItem eventKey={3} onClick={() => this.changePage('video')}>Video</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="content">
          {this.state.displayPresenter && <Presenter />}
          {this.state.displayReceiver && <Receiver />}
          {this.state.displayVideo && <Video />}
        </div>
      </div>
    );
  }
}

export default App;
