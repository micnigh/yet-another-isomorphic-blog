var React = require("react");
import { Link } from "react-router";
var { baseUrl } = require("../baseUrl");

class Navigation extends React.Component {
  render () {
    return (
      <div className="navigation">
        <Link to={`${baseUrl}`} activeClassName="active" className="brand">Yet Another Isomorphic Blog</Link>
      </div>
    );
  }
}

export default Navigation;
