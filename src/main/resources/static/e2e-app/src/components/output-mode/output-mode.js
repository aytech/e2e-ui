import React, { Component } from 'react';
import { connect } from "react-redux";
import { updateDebugEnabled, updateErrorEnabled } from "../../actions/outputModeActions";

class OutputMode extends Component {

  toggleDebugEnabled = () => {
    const {
      errorOutputEnabled,
      debugOutputEnabled
    } = this.props.state;

    if (errorOutputEnabled === true && debugOutputEnabled === false) {
      this.props.updateErrorEnabled(false);
    }
    this.props.updateDebugEnabled(!debugOutputEnabled);
  };

  toggleErrorEnabled = () => {
    const {
      debugOutputEnabled,
      errorOutputEnabled
    } = this.props.state;
    if (debugOutputEnabled === true && errorOutputEnabled === false) {
      this.props.updateDebugEnabled(false)
    }
    this.props.updateErrorEnabled(!errorOutputEnabled)
  };

  getSwitchElement = (label, id, state, onChangeHandler) => {
    return (
      <div className="custom-control custom-switch">
        <input type="checkbox" className="custom-control-input" id={ id } checked={ state }
               onChange={ onChangeHandler }/>
        <label className="custom-control-label" htmlFor={ id }>{ label }</label>
      </div>
    )
  };

  getDebugOutputSwitch = () => {
    const { debugOutputEnabled, stdInput } = this.props.state;
    if (stdInput.length === 0) {
      return null
    }
    return this.getSwitchElement('Show debug output', 'debugSwitch', debugOutputEnabled, this.toggleDebugEnabled)
  };

  getErrorOutputSwitch = () => {
    const { errorOutputEnabled, stdErr } = this.props.state;
    if (stdErr.length === 0) {
      return null
    }
    return this.getSwitchElement('Show error output', 'errorSwitch', errorOutputEnabled, this.toggleErrorEnabled)
  };

  render() {
    return (
      <div className="form-group">
        { this.getDebugOutputSwitch() }
        { this.getErrorOutputSwitch() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateDebugEnabled: (status) => dispatch(updateDebugEnabled(status)),
  updateErrorEnabled: (status) => dispatch(updateErrorEnabled(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(OutputMode);