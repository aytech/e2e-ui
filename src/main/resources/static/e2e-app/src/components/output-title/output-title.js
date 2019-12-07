import React, { Component } from 'react';
import { connect } from "react-redux";

class OutputTitle extends Component {

  getText = () => {
    const {
      buildInProgress,
      messages,
      serverErrorState,
      startedTimestamp
    } = this.props.state;

    if (buildInProgress === true) {
      const now = new Date();
      const diff = now.getTime() - startedTimestamp;
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor(((diff % 86400000) % 3600000) / 60000);
      const seconds = Math.floor((((diff % 86400000) % 3600000) % 60000) / 1000);
      let timeText = `${ seconds } seconds`;

      if (minutes > 0) {
        timeText = `${ minutes } minutes ${ timeText }`;
      }
      if (hours > 0) {
        timeText = `${ hours } hours ${ timeText }`;
      }

      return (
        <p>
          <span className="text-warning">
            Build running, please wait. Tests executed:
          </span>
          <span className="text-danger"> { messages.length }</span>,
          <span className="text-warning"> Execution time:</span>
          <span className="text-danger"> { timeText }</span>
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