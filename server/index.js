var express = require("express");

var PORT = process.env.NODE_ENV === "production" ?
  process.env.PORT || 80 :
  process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  PORT = 80;
}
var app = express()
  .use(require("body-parser").urlencoded({
    extended: true,
  }))
  .use(require("body-parser").json())
  .use(require("compression")())
  .use(express.static(__dirname + "/public"));

var server = app.listen(PORT, "0.0.0.0", function () {
  var url = "http://" + require("os").hostname() + ":" + server.address().port + "/";
  console.log("Server listening at " + url);
});
