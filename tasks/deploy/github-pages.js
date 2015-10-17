var gulp = require("gulp");
var ghPages = require("gulp-gh-pages");

var generateTask = function({
  taskName,
  dependsOn = [],
  staticPath,
}) {
  gulp.task(taskName, dependsOn.concat([
    "build:static",
  ]), function () {
    return gulp.src(`${staticPath}/**/*`)
      .pipe(ghPages());
  });
};

module.exports = {
  generateTask,
};
