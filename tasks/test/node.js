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
      "!test/entry.js"
    ])
      .pipe(plumber())
      .pipe(jasmine({
        loadConfig: {
          helpers: ["test/entry.js"],
        },
      }))
      .on("error", function (e) {
        console.log(e.toString());
      })
      .on("finish", done);
  });
};

module.exports = {
  generateTask,
};
