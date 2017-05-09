import React from 'react';
import { Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import '../app.scss';

import { Home } from '../components/Home';

export const AppContainer = () =>
  <div className="layout">
    <ul>
      <li><Link to="/">Home</Link></li>
    </ul>
    <hr />
    <Route exact path="/" component={Home} />
  </div>;
