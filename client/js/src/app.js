require("app/config");

/* eslint-disable no-unused-vars */
var React = require("react");
var ReactDOM = require("react-dom");
/* eslint-enable no-unused-vars */

import { Router, } from "react-router";
var routes = require("routes");
var data = require("data.json");
import { createHistory, useBasename } from "history";

var baseUrl = "";
if (process.env.NODE_ENV !== "development") {
  baseUrl = process.env.BASE_URL.slice(0, -1);
}

var history = useBasename(createHistory)({
  basename: baseUrl,
});

ReactDOM.render((
  <Router history={history}>
    { routes({
      data,
      baseUrl,
    }) }
  </Router>
), document.getElementById("content"));
