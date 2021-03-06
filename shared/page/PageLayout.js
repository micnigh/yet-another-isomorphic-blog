import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Navigation from "../component/Navigation";

var defaultState = {
  transitionName: "in-from-top",
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
    // revert animation to default for next request
    setTimeout(() => {
      this.setState({transitionName: defaultState.transitionName});
    }, 0);
  }
}

export default PageLayout;
