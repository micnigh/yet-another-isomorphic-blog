require("app/config");

var React = require("react");
var ReactDOM = require("react-dom");

class Blog extends React.Component {
  render () {
    return <h1>Blog</h1>;
  }
}

ReactDOM.render(
  <Blog/>,
  document.getElementById("content")
);
