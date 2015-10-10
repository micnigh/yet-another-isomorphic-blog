var browsersync = require("browser-sync");
var argv = require("yargs").argv;
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var karma = require("karma");

var gft = require("gulp-frontend-tasks")(gulp);

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var bsApp = browsersync.create();
var bsTest = browsersync.create();

var distPath = "server/public";
var testPath = ".tmp/test/";

var karmaPort = 3001;
var bsAppPort = 3002;
var bsTestPort = 3004;

var libs = [
  "underscore",
  "es5-shim/es5-shim",
  "es5-shim/es5-sham",
];

var testLibs = [
  "chai",
];

gft.generateTask("js", {
  taskName: "lib",
  entries: [
    "client/js/libs/entry.js",
  ],
  includes: [
    "client/js/libs",
  ],
  dest: distPath + "/js/",
  destFileName: "lib.js",
  browserify: {
    requires: libs,
  },
  watch: [
    "client/js/libs/entry.js",
  ],
  browsersync: bsApp,
});

gft.generateTask("js", {
  taskName: "app",
  entries: [
    "client/js/src/*.js",
  ],
  dest: distPath + "/js/",
  includes: [
    "client/js/src",
  ],
  browserify: {
    externals: libs,
  },
  watch: [
    "client/js/src/*.js",
  ],
  browsersync: bsApp,
});

gft.generateTask("js", {
  taskName: "testLib",
  entries: [
    "client/js/test/libs/entry.js",
  ],
  includes: [
    "client/js/test/libs",
  ],
  dest: testPath + "/js/",
  destFileName: "testLib.js",
  browserify: {
    requires: testLibs,
  },
  watch: [
    "client/js/test/libs/entry.js",
  ],
  browsersync: bsTest,
});

gft.generateTask("js", {
  taskName: "test",
  entries: [
    "client/js/test/src/**/*.js",
  ],
  dest: testPath + "/js/",
  includes: [
    "client/js/test/src",
    "client/js/src",
  ],
  browserify: {
    externals: libs.concat(testLibs),
  },
  watch: [
    "client/js/test/src/**/*.js",
  ],
  browsersync: bsTest,
});

gulp.task("build:js", [
  "build:js:lib",
  "build:js:app",
  "build:js:test",
]);

gulp.task("watch:js", [
  "watch:js:lib",
  "watch:js:app",
  "watch:js:test",
]);

gft.generateTask("css:scss", {
  taskName: "app",
  entries: [
    "client/css/src/*.scss",
  ],
  includes: [
    "client/css/src/",
    "node_modules/",
  ],
  dest: distPath + "/css/",
  watch: [
    "client/css/src/**/*.scss",
  ],
  browsersync: bsApp,
});

gulp.task("build:css", [
  "build:css:scss:app",
]);

gulp.task("watch:css", [
  "watch:css:scss:app",
]);

gulp.task("build", [
  "build:js",
  "build:css",
]);

gulp.task("serve", [], function () {
  nodemon({
    watch: [
      "server",
    ],
    ignore: [
      "server/public/js/*.js*",
      "server/public/css/*.css*",
    ],
    script: "server/index.js",
    ext: "js html",
  });
});

gulp.task("test:karma", [
  "build:js:testLib",
  "build:js:test",
], function (done) {
  new karma.Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, done).start();
});

gulp.task("watch:test:karma", [
  "build:js:testLib",
  "build:js:test",
], function (done) {
  new karma.Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: false
  }, done).start();
});

gulp.task("test", [
  "test:karma",
]);

gulp.task("watch:initBrowserify", [
  "watch:initBrowserify:app",
  "watch:initBrowserify:test",
]);

gulp.task("watch:initBrowserify:app", function (done) {
  bsApp.init({
    logSnippet: false,
    open: false,
    notify: false,
    port: bsAppPort,
    ui: {
      port: bsAppPort + 1,
    },
  }, done);
});

gulp.task("watch:initBrowserify:test", function (done) {
  bsTest.init({
    logSnippet: false,
    open: false,
    notify: false,
    port: bsTestPort,
    ui: {
      port: bsTestPort + 1,
    },
  }, done);
});

gulp.task("watch", [
  "watch:js",
  "watch:css",
  "watch:initBrowserify",
  "serve",
  "watch:test:karma",
]);

gulp.task("default", ["watch"]);

module.exports = {
  distPath: distPath,
  testPath: testPath,
  karmaPort: karmaPort,
};
