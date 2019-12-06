import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  updateFailedOutput,
  updatePassedOutput,
  updateSkippedOutput
} from "../../actions/outputActions";

class OutputSort extends Component {

  togglePassedOutput = () => {
    const { isPassedOutputActive } = this.props.state;
    if (isPassedOutputActive === false) {
      this.props.updateFailedOutput(false);
      this.props.updateSkippedOutput(false);
    }
    this.props.updatePassedOutput(!isPassedOutputActive);
  };

  toggleFailedOutput = () => {
    const { isFailedOutputActive } = this.props.state;
    if (isFailedOutputActive === false) {
      this.props.updatePassedOutput(false);
      this.props.updateSkippedOutput(false);
    }
    this.props.updateFailedOutput(!isFailedOutputActive);
  };

  toggleSkippedOutput = () => {
    const { isSkippedOutputActive } = this.props.state;
    if (isSkippedOutputActive === false) {
      this.props.updateFailedOutput(false);
      this.props.updatePassedOutput(false);
    }
    this.props.updateSkippedOutput(!isSkippedOutputActive);
  };

  getSwitchElement = (label, id, state, onChangeHandler) => {
    return (
      <div className="custom-control custom-switch custom-control-inline">
        <input type="checkbox" className="custom-control-input" id={ id } checked={ state }
               onChange={ onChangeHandler }/>
        <label className="custom-control-label" htmlFor={ id }>{ label }</label>
      </div>
    )
  };

  getPassedOutputSwitch = () => {
    const { isPassedOutputActive, messagesPassed } = this.props.state;
    if (messagesPassed.length === 0) {
      return null
    }
    return this.getSwitchElement(`Passed (${ messagesPassed.length })`, 'passed', isPassedOutputActive, this.togglePassedOutput)
  };

  getFailedOutputSwitch = () => {
    const { isFailedOutputActive, messagesFailed } = this.props.state;
    if (messagesFailed.length === 0) {
      return null
    }
    return this.getSwitchElement(`Failed (${ messagesFailed.length })`, 'failed', isFailedOutputActive, this.toggleFailedOutput)
  };

  getSkippedOutputSwitch = () => {
    const { isSkippedOutputActive, messagesSkipped } = this.props.state;
    if (messagesSkipped.length === 0) {
      return null
    }
    return this.getSwitchElement(`Skipped (${ messagesSkipped.length })`, 'skipped', isSkippedOutputActive, this.toggleSkippedOutput)
  };

  render() {
    const {
      debugOutputEnabled,
      errorOutputEnabled
    } = this.props.state;

    if (debugOutputEnabled === true || errorOutputEnabled === true) {
      return null
    }

    return (
      <div className="form-group">
        { this.getPassedOutputSwitch() }
        { this.getFailedOutputSwitch() }
        { this.getSkippedOutputSwitch() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updatePassedOutput: (status) => dispatch(updatePassedOutput(status)),
  updateFailedOutput: (status) => dispatch(updateFailedOutput(status)),
  updateSkippedOutput: (status) => dispatch(updateSkippedOutput(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(OutputSort);