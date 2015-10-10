require("app/config");

var test = [1, 2, 3, 4, 5, 6];
var [ one, two, ...rest] = test;
console.log(one, two, rest, "schfifty-five");
