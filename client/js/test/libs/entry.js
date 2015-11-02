/* eslint-disable no-unused-vars */
import "regenerator/runtime";
import Promise from "bluebird";
window.Promise = Promise;
/* eslint-enable no-unused-vars */

if (/PhantomJS/.test(navigator.userAgent)) {
  // no console output if in phantom - too noisy
  console.log = function () {};
} else {
  if (process.env.BROWSERSYNC_ENABLED === "true") {
    document.write(process.env.BROWSERSYNC_SNIPPET);
  }
}
