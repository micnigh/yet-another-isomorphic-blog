import React from "react";
import { Link } from "react-router";
import { baseUrl } from "../baseUrl";

class NotFound extends React.Component {
  render () {
    return (
      <div className="not-found">
        <h4>Not Found :(</h4>
      </div>
    );
  }
}

export default NotFound;
