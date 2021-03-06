var express = require("express");
var handlebars = require("handlebars");
var chalk = require("chalk");
/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */
var path = require("path");
var fs = require("fs");
var indexPageTemplate = handlebars.compile(fs.readFileSync("server/public/index.html", "utf8"));
var _ = require("underscore");

var {
  distPath,
  baseUrl,
} = require("../gulpfile");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
var isDev = "development" === process.env.NODE_ENV;

import { renderToString } from "react-dom/server";
import { match, RoutingContext } from "react-router";

import { relPathToBaseUrl } from "../shared/baseUrl";

import apiRoutes from "./api/";

var PORT = isDev ?
  process.env.PORT || 3000 :
  process.env.PORT || 80;

if (process.env.NODE_ENV === "production") {
  PORT = 80;
}
var app = express()
  .use(require("body-parser").urlencoded({
    extended: true,
  }))
  .use(require("body-parser").json())
  .use(require("compression")());

var server = app.listen(PORT, "0.0.0.0", function () {
  var url = "http://" + require("os").hostname() + ":" + server.address().port + "/";
  console.log("Server listening at " + url);
});

app.get("/", function (req, res, next) {
  if (req.url === baseUrl) {
    next();
  } else {
    res.status(302).redirect(baseUrl);
  }
});

app.get("/data.json", function (req, res) {
  fs.readFile("shared/data.json", "utf8", function (err, dataFileContent) {
    var data = JSON.parse(dataFileContent);
    res.json(data);
  });
});

var clearModuleCacheForSharedModules = function () {
  var escape = require("regexp.escape");
  var regExpString = "^" + escape(`${path.resolve("./shared")}`);
  console.log(`Clearing module cache for RegExp "${regExpString}"`);
  var regExpTester = new RegExp(regExpString);
  for (var k in require.cache) {
    if (regExpTester.test(k)) {
      console.log(chalk.yellow(`deleting module ${k}`));
      delete require.cache[k];
    }
  }
};

var renderApplicationRequest = function (req, res, next) {
  fs.readFile("shared/data.json", "utf8", function (err, dataFileContent) {
    var data = JSON.parse(dataFileContent);
    if (isDev) {
      clearModuleCacheForSharedModules();
    }
    var routes = require("../shared/routes").default;
    match({ routes: routes({
      data,
      baseUrl: `/`,
    }), location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        try {
          res.status(200).send(indexPageTemplate({
            isDev,
            content: renderToString(<RoutingContext {...renderProps} />),
            relPathToBaseUrl: relPathToBaseUrl(req.url),
          }));
        } catch (e) {
          console.log(chalk.red(e.stack));
          next();
        }
      } else {
        res.status(404).send("Not found");
      }
    });
  });
};

app.get(`${baseUrl}`, renderApplicationRequest);
app.use(`${baseUrl}`, express.static(__dirname + "/public"));
app.use(`${baseUrl}`, express.static(distPath));

apiRoutes.forEach(route => {
  _.each(route.methods, (methodFunction, methodType) => {
    app[methodType](`${baseUrl}${route.path}`, [], methodFunction);
    app[methodType](`${baseUrl}${route.path}:queryParams`, [], methodFunction);
  });
});

app.get(`${baseUrl}*`, renderApplicationRequest);
