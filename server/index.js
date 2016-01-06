process.env.NODE_ENV = process.env.NODE_ENV || "development";
require("babel-core/register")({
  presets: [
    "babel-preset-es2015",
    "babel-preset-react",
  ],
  plugins: [
    "syntax-async-functions",
    "transform-regenerator",
  ],
});
require("./server");
