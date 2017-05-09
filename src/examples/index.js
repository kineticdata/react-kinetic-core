import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createHashHistory } from 'history';

import { AppContainer } from './containers/AppContainer';
import { configureStore } from './redux/store';

// This src/index.js file is the main entry into the React application.  It does
// not contain much application code, instead it is mostly boilerplate code that
// wires up some of the features we want to add to our React application.
//
// When getting started, the most important piece is the line that contains:
//   <Route path="/" component={AppContainer}/>
// which specifies that the root of the application is to be AppContainer which
// can be found in containers/AppContainer.js.  The rest of the application gets
// included as descendants of that component.
//
// The rest of the code below is doing things like setting up a client-side
// router that allows us to define multiple routes and pages all on the
// client-side.  We also setup a redux store, which is a strategy we use for
// storing and organizing the state of the application.  Finally we configure
// the application to support hot module reloading (hmr), which means we can
// update code in our editor and see changes in the browser without refreshing
// the page.

// Create the history instance that enables client-side application routing.
const history = createHashHistory();

// Create the redux store with the configureStore helper found in redux/store.js
const store = configureStore(history);

// Get the root DOM element in which our entire React app will be rendered.
const rootElement = document.getElementById('root');

// Define a render helper function that wraps our root component (AppContainer)
// with the router, redux store, and hot module loader components.  We want this
// defined as a function because we want to be able to call it once for the
// initial page load and again when code changes are detected (see below).
const render = () => {
  ReactDOM.render(
    <HotLoaderContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={AppContainer} />
        </ConnectedRouter>
      </Provider>
    </HotLoaderContainer>,
    rootElement);
};

// Trigger the initial render of our application.
render();

// Triggers subsequent re-renders after code changes are detected.
if (module.hot) module.hot.accept('./containers/AppContainer', render);
