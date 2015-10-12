var React = require("react");
import { Link } from "react-router";

class Navigation extends React.Component {
  render () {
    return (
      <div>
        <Link to={`/`} activeClassName="active">Yet Another Isomorphic Blog</Link>
      </div>
    );
  }
}

export default Navigation;
