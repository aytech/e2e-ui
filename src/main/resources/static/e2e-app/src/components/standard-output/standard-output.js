import React, { Component } from 'react'
import { connect } from "react-redux";

class StandardOutput extends Component {

  getMessageElements = (messages, className) => {
    return messages.map(
      (line, index) => <p className={ className } key={ index }>{ line }</p>
    )
  };

  getOutput = () => {
    const {
      debugOutputEnabled,
      errorOutputEnabled,
      isFailedOutputActive,
      isPassedOutputActive,
      isSkippedOutputActive,
      messages,
      messagesFailed,
      messagesPassed,
      messagesSkipped,
      stdErr,
      stdInput
    } = this.props.state;

    if (debugOutputEnabled === true) {
      return this.getMessageElements(stdInput, 'text-warning')
    }
    if (errorOutputEnabled === true) {
      return this.getMessageElements(stdErr, 'text-danger')
    }
    if (isPassedOutputActive === true) {
      return this.getMessageElements(messagesPassed, 'text-success')
    }
    if (isSkippedOutputActive === true) {
      return this.getMessageElements(messagesSkipped, 'text-warning')
    }
    if (isFailedOutputActive === true) {
      return this.getMessageElements(messagesFailed, 'text-danger')
    }

    return this.getMessageElements(messages, 'text-muted')
  };

  render() {
    return (
      <div className="output">
        { this.getOutput() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps, {})(StandardOutput);