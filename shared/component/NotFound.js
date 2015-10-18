var React = require("react");
import { Link } from "react-router";
var { baseUrl } = require("../baseUrl");

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
