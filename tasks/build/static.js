var gulp = require("gulp");
var concat = require("gulp-concat");
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

var isDev = "development" === process.env.NODE_ENV;

var generateTask = function({
  taskName,
  dependsOn,
  staticPath,
  distPath,
  jsAssets,
  baseUrl,
}) {
  gulp.task(taskName, dependsOn.concat([
    `${taskName}:concat-js-assets`,
    `${taskName}:copy-assets`,
    `${taskName}:html`,
    `${taskName}:sitemap`,
  ]));

  gulp.task(`${taskName}:concat-js-assets`, dependsOn, function () {
    return gulp.src(jsAssets)
      .pipe(concat("all.js"))
      .pipe(gulp.dest(`${staticPath}/js/`));
  });

  gulp.task(`${taskName}:copy-assets`, dependsOn.concat([
    `${taskName}:concat-js-assets`,
  ]), function () {
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

    // TODO: turn this into promises so we can wait for all to complete,
    // and call done then
    routePaths.forEach(routePath => {
      convertRoutePathToHtml({
        routes,
        routePath,
        template
      }, (error, { routePath, html }) => {
        if (error) { console.log(chalk.red(error.stack)); return; }
        var filePath = `${staticPath}${routePath}`;
        if (/\/$/.test(filePath)) {
          filePath = filePath + "index.html";
        } else {
          filePath = filePath + ".html";
        }
        shelljs.mkdir("-p", path.dirname(filePath));
        fs.writeFileSync(filePath, html);
      });
    });

    done();
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
        url: `${baseUrl.slice(0, -1)}${route}`, changefreq: "weekly", priority: priority, lastmod: now
      });
    });

    var sitemap = Sitemap.createSitemap({
      baseUrl: `${baseUrl}`,
      // 600 sec cache period
      cacheTime: 600000,
      urls: urls
    });

    shelljs.mkdir("-p", path.dirname(staticPath));
    fs.writeFileSync(`${staticPath}/sitemap.xml`, sitemap);

    done();
  });
};

var convertRoutePathToHtml = function ({ routes, routePath, template }, callback) {
  match({ routes: routes, location: `/${routePath}` }, (e, redirectLocation, renderProps) => {
    if (e) { callback(e, {}); return; }
    if (renderProps) {
      try {
        var html = template({
          isDev,
          content: renderToString(<RoutingContext {...renderProps} />),
          relPathToBaseUrl: "../".repeat(routePath.match(/\//g).length - 1).slice(0, -1),
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
