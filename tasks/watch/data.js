var gulp = require("gulp");
var _ = require("underscore");
var gWatch = require("gulp-watch");

module.exports = function () {
  return gWatch([
    "posts/*.md"
  ],
  _.debounce(function () {
    gulp.start("build:data");
  }, 100));
};
