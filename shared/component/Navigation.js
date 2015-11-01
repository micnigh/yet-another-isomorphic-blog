import React from "react";
import { Link, IndexLink } from "react-router";
import { baseUrl } from "../baseUrl";

class Navigation extends React.Component {
  render () {
    return (
      <div className="navigation">
        <IndexLink to={`${baseUrl}`} activeClassName="active" className="brand">Yet Another Isomorphic Blog</IndexLink>
      </div>
    );
  }
}

export default Navigation;
