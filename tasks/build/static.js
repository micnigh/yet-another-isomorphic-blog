var gulp = require("gulp");
var chalk = require("chalk");
var handlebars = require("handlebars");
/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */
import { renderToString } from "react-dom/server";
import { match, RoutingContext } from "react-router";
var fs = require("fs");
var shelljs = require("shelljs");
var path = require("path");
var Sitemap = require("sitemap");

import { relPathToBaseUrl } from "../../shared/baseUrl";

var isDev = "development" === process.env.NODE_ENV;

var generateTask = function({
  taskName,
  dependsOn,
  staticPath,
  distPath,
  baseUrl,
  domain,
}) {
  gulp.task(taskName, dependsOn.concat([
    `${taskName}:copy-assets`,
    `${taskName}:html`,
    `${taskName}:sitemap`,
  ]));

  gulp.task(`${taskName}:copy-assets`, dependsOn, function () {
    return gulp.src([
      `${distPath}/**/*.js`,
      `${distPath}/**/*.css`,
      `${distPath}/**/*.png`,
    ])
      .pipe(gulp.dest(staticPath));
  });

  gulp.task(`${taskName}:html`, dependsOn, function (done) {
    var data = require("../../shared/data.json");
    var routes = require("../../shared/routes")({
      data,
      baseUrl,
    });
    var routePaths = convertRoutesToPaths(routes);
    var template = handlebars.compile(fs.readFileSync("server/public/index.html", "utf8"));

    Promise.all(routePaths.map(routePath => {
      return new Promise((resolve, reject) => {
        convertRoutePathToHtml({
          routes,
          routePath,
          template,
          baseUrl,
        }, (error, { routePath, html }) => {
          if (error) { reject(error.stack); return; }
          var filePath = `${staticPath}${routePath.replace(baseUrl, "/")}`;
          if (/\/$/.test(filePath)) {
            filePath = filePath + "index.html";
          } else {
            filePath = filePath + ".html";
          }
          shelljs.mkdir("-p", path.dirname(filePath));
          fs.writeFileSync(filePath, html);
          resolve();
        });
      });
    })).then(() => {
      done();
    }, error => {
      if (error) { console.log(chalk.red(error.stack)); done(); return; }
    });
  });

  gulp.task(`${taskName}:sitemap`, dependsOn, function (done) {
    var data = require("../../shared/data.json");
    var routes = require("../../shared/routes")({
      data,
      baseUrl,
    });
    var routePaths = convertRoutesToPaths(routes);

    var urls = [];
    var now = new Date();

    routePaths.forEach( route => {
      // / => 0, /foo => 1, /foo/bar => 2
      var depth = (route.match(/\//g) || []).length;

      // / => 1, /foo => 0.5, /foo/bar => 0.33
      var priority = (route === "/" ? 1 : 1 / (depth + 1));

      urls.push({
        url: `https://${domain}${route}`, changefreq: "weekly", priority: priority, lastmod: now
      });
    });

    var sitemap = Sitemap.createSitemap({
      baseUrl: `https://${domain}${baseUrl}`,
      // 600 sec cache period
      cacheTime: 600000,
      urls: urls
    });

    shelljs.mkdir("-p", path.dirname(staticPath));
    fs.writeFileSync(`${staticPath}/sitemap.xml`, sitemap);

    done();
  });
};

var convertRoutePathToHtml = function ({ routes, routePath, template, baseUrl }, callback) {
  match({ routes: routes, location: `/${routePath}` }, (e, redirectLocation, renderProps) => {
    if (e) { callback(e, {}); return; }
    if (renderProps) {
      try {
        var html = template({
          isDev,
          content: renderToString(<RoutingContext {...renderProps} />),
          relPathToBaseUrl: relPathToBaseUrl(routePath),
        });
        callback(null, {
          html,
          routePath,
        });
      } catch (e) {
        callback(e, {});
        return;
      }
    }
  });
};

var convertRoutesToPaths = function (routes, parentPath) {
  var result = [];
  routes = Array.isArray(routes) ? routes : [routes];

  routes.forEach(route => {
    if (Array.isArray(route)) {
      result = result.concat(convertRoutesToPaths(route, parentPath));
    } else {
      var { props } = route;
      var { path: routePath } = props;
      if (routePath) {
        routePath = parentPath ? parentPath + routePath : routePath;
        result.push(routePath);
      }
      if (props.children) {
        result = result.concat(convertRoutesToPaths(props.children, routePath));
      }
    }
  });

  return result;
};

module.exports = {
  generateTask,
};
