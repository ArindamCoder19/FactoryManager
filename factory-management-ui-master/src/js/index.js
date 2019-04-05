import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { AUTH_USER } from './actions/types/index';
import { getNotifications } from './actions/notificationActions';
import reducers from './reducers';
import RouteList from './RouteList';
import browserHistory from './components/general/BrowserHistory';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const store = createStoreWithMiddleware(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const token = localStorage.getItem('token');

//If we have a token, consider the user to be signed in
if (token) {
  // We need to update application state
  axios.defaults.headers.common['X-Access-Token']=localStorage.token;
  axios.defaults.headers.common['Cache-Control']='no-cache';
  let decodeData = jwtDecode(token);
  store.dispatch(getNotifications());
  store.dispatch({ type: AUTH_USER, payload: decodeData});
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <RouteList />
    </Router>
  </Provider>
  , document.getElementById('main'));
