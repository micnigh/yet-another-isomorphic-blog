import "app/config";

/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
/* eslint-enable no-unused-vars */

import { Router, Route } from "react-router";
import routes from "routes";
import data from "data.json";
import { createHistory } from "history";
var history = createHistory();

import NotFound from "component/NotFound";

ReactDOM.render((
  <Router history={history}>
    { routes({
      data,
    }) }
    <Route path="*" component={NotFound}/>
  </Router>
), document.getElementById("content"));
