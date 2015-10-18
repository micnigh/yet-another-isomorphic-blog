var gulp = require("gulp");
var concat = require("gulp-concat");

var generateTask = function({
  taskName,
  dependsOn,
  distPath,
  jsAssets,
}) {
  gulp.task(`${taskName}`, dependsOn, function () {
    return gulp.src(jsAssets)
      .pipe(concat("all.js"))
      .pipe(gulp.dest(`${distPath}/js/`));
  });
};

module.exports = {
  generateTask,
};
