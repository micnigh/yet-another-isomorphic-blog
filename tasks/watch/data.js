var gulp = require("gulp");
var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateTask = function({
  taskName,
  dependsOn = [],
}) {
  gulp.task(taskName, dependsOn, function () {
    return gWatch([
      "posts/*.md",
    ],
    _.debounce(function () {
      gulp.start("build:data");
    }, 100));
  });
};

module.exports = {
  generateTask,
};
