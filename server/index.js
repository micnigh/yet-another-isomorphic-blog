process.env.NODE_ENV = process.env.NODE_ENV || "development";
require("babel-core/register")({
  optional: ["es7.asyncFunctions"],
});
require("./server");
