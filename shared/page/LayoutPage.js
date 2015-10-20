var React = require("react");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");

var Navigation = require("../component/Navigation");

class PageLayout extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      transitionName: "in-from-right",
    };
    this.setTransitionName.bind(this);
  }

  render () {
    var { pathname } = this.props.location;
    var self = this;
    return (
      <div>
        <Navigation/>
        <ReactCSSTransitionGroup transitionName={ this.state.transitionName } transitionEnterTimeout={1000} transitionLeaveTimeout={1000} component="div" className="animation-wrapper">
          { React.cloneElement(this.props.children, { key: pathname, setTransitionName: (transitionName) => {
            self.setTransitionName(transitionName);
          } }) }
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  setTransitionName(transitionName) {
    this.setState({transitionName});
  }
}

export default PageLayout;
