import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../app.scss';

import { Home } from '../components/Home';
import { Modals } from '../components/Modals';
import { Forms } from '../components/Forms';

export const AppContainer = () =>
  <div>
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">React Kinetic Core</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem href="https://github.com/KineticCommunity/react-kinetic-core" target="_blank">GitHub</NavItem>
      </Nav>
    </Navbar>
    <Grid>
      <Row>
        <Col xs="9">
          <Route exact path="/" component={Home} />
          <Route exact path="/modals" component={Modals} />
          <Route exact path="/forms" component={Forms} />
        </Col>
        <Col xs="3">
          <Nav bsStyle="pills" stacked>
            <LinkContainer to="/modals">
              <NavItem href="#">Modals</NavItem>
            </LinkContainer>
            <LinkContainer to="/forms">
              <NavItem href="#">Forms</NavItem>
            </LinkContainer>
          </Nav>
        </Col>
      </Row>
    </Grid>
  </div>;
