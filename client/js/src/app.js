require("app/config");

/* eslint-disable no-unused-vars */
var React = require("react");
var ReactDOM = require("react-dom");
/* eslint-enable no-unused-vars */

import { Router, Route } from "react-router";
var routes = require("routes");
var data = require("data.json");
import { createHistory } from "history";
var history = createHistory();

var NotFound = require("component/NotFound");

ReactDOM.render((
  <Router history={history}>
    { routes({
      data,
    }) }
    <Route path="*" component={NotFound}/>
  </Router>
), document.getElementById("content"));
