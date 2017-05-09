import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { reducer as formReducer } from 'redux-form';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reducers from './reducers';

export const configureStore = (history) => {
  // To enable the redux dev tools in the browser we need to conditionally use a
  // special compose method, below we are looking for that and if it does not
  // exist we use the build-in redux 'compose' method.
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // Create the redux store using reducers imported from our 'redux/reducers'
  // module.  Note that we also have some connected react router and redux form
  // setup going on here as well.
  const store = createStore(
    connectRouter(history)(combineReducers({ ...reducers, form: formReducer })),
    composeEnhancers(applyMiddleware(routerMiddleware(history), promiseMiddleware)),
  );
  // Enable hot module replacement so that file changes are automatically
  // communicated to the browser when running in development mode
  if (module.hot) {
    module.hot.accept(
      './reducers',
      () => store.replaceReducer(connectRouter(history)(combineReducers(reducers))));
  }
  return store;
};
