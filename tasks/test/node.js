var gulp = require("gulp");
var plumber = require("gulp-plumber");
var jasmine = require("gulp-jasmine");
var es = require("event-stream");
var fs = require("fs");

var generateTask = function({
  taskName,
  dependsOn = [],
}) {
  var testEntryContents = fs.readFileSync("test/entry.js");
  gulp.task(taskName, dependsOn, function (done) {
    gulp.src([
      "test/**/*.js",
      "!test/entry.js"
    ])
      .pipe(es.map(function (file, cb) {
        file.contents = new Buffer(`${testEntryContents}\n${file.contents}`);
        cb(null, file);
      }))
      .pipe(gulp.dest(".tmp/test/node/"))
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
