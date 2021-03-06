import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  Switch
} from "react-router-dom";
import './index.css';
import App from './components/app/app';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from "./store";
import { createBrowserHistory } from "history";
import DownloadReport from "./components/download/download";

const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={ configureStore() }>
    <Router history={ history }>
      <Switch>
        <Route path='/download/report/:nodeID' render={ props => <DownloadReport { ...props }/> }/>
        <Route path='/' render={ props => <App { ...props }/> }/>
      </Switch>
    </Router>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
