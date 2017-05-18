import React from 'react';
import { Button } from 'react-bootstrap';

export const Home = () => (
  <div>
    <div className="text-center">
      <h1>React Kinetic Core</h1>
      <p className="lead">Easy to use React components for Kinetic Core bundles.</p>
      <span>
        <Button bsSize="large" bsStyle="default" href="https://github.com/KineticCommunity/react-kinetic-core" target="_blank">View on GitHub</Button>
        {' '}
        <Button bsSize="large" bsStyle="default" href="http://www.kineticdata.com" target="_blank">About Us</Button>
      </span>
    </div>
    <h2>Installation</h2>

    <h4>With NPM</h4>
    <div>$ npm install --save react-kinetic-core</div>

    <h4>With yarn</h4>
    <div>$ yarn add react-kinetic-core</div>
  </div>
);
