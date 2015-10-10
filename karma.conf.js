var distPath = require("./gulpfile").distPath;
var testPath = require("./gulpfile").testPath;
var karmaPort = require("./gulpfile").karmaPort;

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "source-map-support"],
    browsers: [
      "PhantomJS",
    ],
    reporters: [
      "progress",
      "html",
      //"spec",
    ],
    port: karmaPort,
    logLevel: config.LOG_INFO,
    //singleRun: true,
    files: [
      {
        pattern: distPath + "/js/lib.js",
        included: true,
        watched: true,
        served: true,
      },
      {
        pattern: testPath + "/js/testLib.js",
        included: true,
        watched: true,
        served: true,
      },
      {
        pattern: testPath + "/js/**/*.js",
        included: true,
        watched: true,
        served: true,
      },
      {
        pattern: testPath + "/js/**/*.js.map",
        included: false,
        watched: true,
        served: true,
      },
      {
        pattern: testPath + "/css/**/*.css",
        included: true,
        watched: true,
        served: true,
      },
      {
        pattern: distPath + "/css/**/*.css",
        included: true,
        watched: false,
        served: true,
      },
      {
        pattern: distPath + "/**/*.*",
        included: false,
        watched: false,
        served: true,
      },
    ],
  });
};
