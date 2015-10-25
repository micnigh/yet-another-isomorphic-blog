var gulp = require("gulp");
var plumber = require("gulp-plumber");
var jasmine = require("gulp-jasmine");

var generateTask = function({
  taskName,
  dependsOn = [],
}) {
  gulp.task(taskName, dependsOn, function (done) {
    gulp.src([
      "test/**/*.js",
    ])
      .pipe(plumber())
      .pipe(jasmine())
      .on("error", function (e) {
        console.log(e.toString());
      })
      .on("finish", done);
  });
};

module.exports = {
  generateTask,
};
