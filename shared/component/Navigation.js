var React = require("react");
import { Link } from "react-router";

class Navigation extends React.Component {
  render () {
    return (
      <div className="navigation">
        <Link to={`/`} activeClassName="active" className="brand">Yet Another Isomorphic Blog</Link>
      </div>
    );
  }
}

export default Navigation;
