var chai = require("chai");
chai.should();
window.jasmine.expect = expect;
window.expect = chai.expect;
window.assert = chai.assert;

if (/PhantomJS/.test(navigator.userAgent)) {
  // no console output if in phantom - too noisy
  console.log = function () {};
} else {
  if (process.env.BROWSERSYNC_ENABLED === "true") {
    document.write(process.env.BROWSERSYNC_SNIPPET);
  }
}
