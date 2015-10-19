var React = require("react");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");

var Navigation = require("../component/Navigation");

class PageLayout extends React.Component {
  render () {
    var { pathname } = this.props.location;
    return (
      <div>
        <Navigation/>
        <ReactCSSTransitionGroup transitionName="page" transitionEnterTimeout={1000} transitionLeaveTimeout={1000} component="div" className="animation-outer-wrapper">
          <div key={ pathname } className="animation-inner-wrapper">
            { React.cloneElement(this.props.children, { key: pathname }) }
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default PageLayout;
