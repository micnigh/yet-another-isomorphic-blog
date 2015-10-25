var gulp = require("gulp");
var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateTask = function({
  taskName,
  dependsOn = [],
}) {
  gulp.task(taskName, dependsOn, function () {
    return gWatch([
      "test/**/*.js",
    ],
    _.debounce(function () {
      gulp.start("test:node");
    }, 100));
  });
};

module.exports = {
  generateTask,
};
