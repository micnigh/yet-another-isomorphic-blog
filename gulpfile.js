var browsersync = require("browser-sync");
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var karma = require("karma");

var gft = require("gulp-frontend-tasks")(gulp);

require("babel-core/register");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var isDev = "development" === process.env.NODE_ENV;

var bsApp = browsersync.create();
var bsTest = browsersync.create();

var distPath = ".tmp/dev";
if (!isDev) {
  distPath = ".tmp/prod";
}
var staticPath = ".tmp/static";
var testPath = ".tmp/test/";

var baseUrl = "/";
if (!isDev) {
  baseUrl = "/yet-another-isomorphic-blog/";
}
process.env.BASE_URL = baseUrl;
var domain = "micnigh.github.io";

var karmaPort = 3001;
var bsAppPort = 3002;
var bsTestPort = 3004;

module.exports = {
  distPath: distPath,
  baseUrl: baseUrl,
  domain: domain,
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
  "react-addons-css-transition-group",
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
    transforms: {
      babelify: {
        presets: ["babel-preset-es2015", "babel-preset-react"],
      }
    }
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

require("./tasks/build/js/all").generateTask({
  taskName: "build:js:all",
  dependsOn: [
    "build:js:lib",
    "build:js:data",
    "build:js:app",
  ],
  distPath: distPath,
  jsAssets: [
    distPath + "/js/lib.js",
    distPath + "/js/data.js",
    distPath + "/js/app.js",
  ],
});

gulp.task("build:js", [
  "build:js:lib",
  "build:js:data",
  "build:js:app",
  "build:js:all",
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
    "client/css/libs/",
    "node_modules/",
  ],
  dest: distPath + "/css/",
  watch: [
    "client/css/src/**/*.scss",
    "!client/css/src/app/shared/sprites.*",
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
  spriteCSSFile: "client/css/src/app/shared/sprites.scss",
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

require("./tasks/build/data").generateTask({
  taskName: "build:data",
});

require("./tasks/watch/data").generateTask({
  taskName: "watch:data",
  dependsOn: [ "build:data" ],
});

require("./tasks/build/static").generateTask({
  taskName: "build:static",
  dependsOn: [
    "build",
  ],
  staticPath: staticPath,
  distPath: distPath,
  baseUrl: baseUrl,
  domain: domain,
});

require("./tasks/deploy/github-pages").generateTask({
  taskName: "deploy:github-pages",
  staticPath: staticPath,
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
      "shared/routes.js",
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

gulp.task("test:browser", [
  "build:js:testLib",
  "build:js:test",
], function (done) {
  new karma.Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, done).start();
});

gulp.task("watch:test:browser", [
  "build:js:testLib",
  "build:js:test",
], function (done) {
  new karma.Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: false
  }, done).start();
});

require("./tasks/test/node").generateTask({
  taskName: "test:node",
});

require("./tasks/watch/test/node").generateTask({
  taskName: "watch:test:node",
  dependsOn: [ "test:node" ],
});

gulp.task("test", [
  "test:browser",
  "test:node",
]);

gulp.task("watch:test", [
  "watch:test:browser",
  "watch:test:node",
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
  "watch:test",
  "watch:data",
]);

gulp.task("default", ["watch"]);
