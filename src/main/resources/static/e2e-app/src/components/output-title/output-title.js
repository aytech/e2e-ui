import React, { Component } from 'react';
import { connect } from "react-redux";

class OutputTitle extends Component {

  getText = () => {
    const {
      buildInProgress,
      messages,
      serverErrorState
    } = this.props.state;

    if (buildInProgress === true) {
      return (
        <p className="text-danger">
          Build running, please wait. Tests executed: ({ messages.length })
        </p>
      )
    }

    if (serverErrorState === true) {
      return (
        <p className="text-danger">
          Internal server error, cannot handle requests
        </p>
      )
    }

    return (
      <p className="text-warning">
        No builds are currently running. Previous output:
      </p>
    )
  };

  render() {
    return (
      this.getText()
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps, {})(OutputTitle);