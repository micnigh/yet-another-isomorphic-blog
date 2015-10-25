var React = require("react");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");

var Navigation = require("../component/Navigation");

var defaultState = {
  transitionName: "in-from-right",
  transitionDuration: 1000,
};

class PageLayout extends React.Component {
  constructor (props) {
    super(props);
    this.state = Object.assign({}, defaultState);
    this.setTransitionName.bind(this);
  }

  render () {
    var { pathname } = this.props.location;
    var self = this;
    return (
      <div>
        <Navigation/>
        <ReactCSSTransitionGroup transitionName={ this.state.transitionName } transitionEnterTimeout={ this.state.transitionDuration } transitionLeaveTimeout={ this.state.transitionDuration } component="div" className="animation-wrapper">
          { React.cloneElement(this.props.children, { key: pathname, setTransitionName: (transitionName) => {
            self.setTransitionName(transitionName);
          } }) }
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  setTransitionName(transitionName) {
    this.setState({transitionName});
    // revert animation to default when done
    setTimeout(() => {
      this.setState({transitionName: defaultState.transitionName});
    }, this.state.transitionDuration);
  }
}

export default PageLayout;
