var chai = require("chai");
chai.should();
jasmine.expect = expect;
var expect = chai.expect;
var assert = chai.assert;

describe("Can Run Tests", function () {
  it("can run a simple test", function () {
    expect(true).to.equal(true);
  });
});
