var browsersync = require("browser-sync");
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var karma = require("karma");

var gft = require("gulp-frontend-tasks")(gulp);

require("babel/register");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var bsApp = browsersync.create();
var bsTest = browsersync.create();

var distPath = "server/public";
var staticPath = ".tmp/static";
var testPath = ".tmp/test/";

var karmaPort = 3001;
var bsAppPort = 3002;
var bsTestPort = 3004;

module.exports = {
  distPath: distPath,
  staticPath: staticPath,
  testPath: testPath,
  karmaPort: karmaPort,
};

var libs = [
  "underscore",
  "es5-shim/es5-shim",
  "es5-shim/es5-sham",
  "react",
  "react-dom",
  "react-router",
  "history/lib/createBrowserHistory"
];

var dataBundle = [
  "data.json",
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
  taskName: "data",
  entries: [
    "client/js/data/entry.js",
  ],
  includes: [
    "client/js/data",
    "shared",
  ],
  dest: distPath + "/js/",
  destFileName: "data.js",
  browserify: {
    requires: dataBundle,
  },
  watch: [
    "shared/data.json",
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
    "shared",
  ],
  browserify: {
    externals: libs.concat(dataBundle),
  },
  watch: [
    "client/js/src/*.js",
    "shared/**/*.js",
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
    "shared",
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
  "build:js:data",
  "build:js:app",
  "build:js:test",
]);

gulp.task("watch:js", [
  "watch:js:lib",
  "watch:js:data",
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
    "!client/css/src/shared/sprites.*",
  ],
  dependsOn: [
    "build:spritesheet:app",
  ],
  browsersync: bsApp,
});

gulp.task("build:css", [
  "build:css:scss:app",
]);

gulp.task("watch:css", [
  "watch:css:scss:app",
]);

gft.generateTask("spritesheet", {
  taskName: "app",
  src: "client/sprites/*.png",
  dest: distPath + "/css/",
  destFileName: "spritesheet_",
  spriteCSSFile: "client/css/src/shared/sprites.scss",
  buildCSSTask: "build:css:scss:app",
  watch: [
    "client/sprites/*.png",
  ],
});

gulp.task("build:spritesheet", [
  "build:spritesheet:app",
]);

gulp.task("watch:spritesheet", [
  "watch:spritesheet:app",
]);

gulp.task("build:data", [], require("./tasks/build/data"));
gulp.task("watch:data", ["build:data"], require("./tasks/watch/data"));

require("./tasks/build/static").generateTask({
  taskName: "build:static",
  dependsOn: [
    "build",
  ],
  staticPath: staticPath,
  distPath: distPath,
  hostname: "http://blog.yet-another-isomorphic-blog.com",
});

gulp.task("build", [
  "build:data",
  "build:js",
  "build:css",
  "build:spritesheet",
]);

gulp.task("serve", [
  "build:data",
], function () {
  nodemon({
    watch: [
      "server",
    ],
    ignore: [
      "server/public/js/*.js*",
      "server/public/css/*.css*",
    ],
    "execMap": {
      "js": "node"
    },
    script: "server/index.js",
    ext: "js md html",
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
  "watch:spritesheet",
  "watch:initBrowserify",
  "serve",
  "watch:test:karma",
  "watch:data",
]);

gulp.task("default", ["watch"]);
