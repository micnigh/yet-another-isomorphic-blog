var React = require("react");
var Navigation = require("../component/Navigation");

class PageLayout extends React.Component {
  render () {
    return (
      <div>
        <Navigation/>
        { this.props.children }
      </div>
    );
  }
}

export default PageLayout;
