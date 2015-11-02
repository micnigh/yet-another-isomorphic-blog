describe("Can Run Tests", function () {
  it("can run a simple test", function () {
    expect(true).toEqual(true);
  });

  it("can run a simple async/await test", async function (done) {
    var i = false;
    var deferred = new Promise((resolve) => {
      setTimeout(()=>resolve(true), 0);
    });
    i = await deferred;
    expect(i).toEqual(true);
    done();
  });
});
