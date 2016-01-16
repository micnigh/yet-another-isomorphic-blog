var baseUrl = "/";
if (process.env.NODE_ENV !== "development") {
  baseUrl = process.env.BASE_URL;
}

var relPathToBaseUrl = function (path) {
  var result = path;
  result = result.replace(baseUrl, "/"); // remove baseUrl
  result = result.replace(/^.*?:\/\//, "", ""); // remove protocol
  result = "../".repeat(result.match(/\//g).length - 1); // each subdir = "../"
  return result;
};

export {
  baseUrl,
  relPathToBaseUrl,
};
