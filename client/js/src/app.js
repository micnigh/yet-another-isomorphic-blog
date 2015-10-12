require("app/config");

/* eslint-disable no-unused-vars */
var React = require("react");
var ReactDOM = require("react-dom");
/* eslint-enable no-unused-vars */

import { Router, } from "react-router";
var routes = require("routes");
var data = require("data.json");
import createBrowserHistory from "history/lib/createBrowserHistory";
var history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    { routes(data) }
  </Router>
), document.getElementById("content"));
