import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import { toggleDebugEnabled, toggleErrorEnabled } from "../../actions/outputActions";
import './output.css';
import DockerService from "../../services/DockerService";

class Output extends Component {

  dockerService = new DockerService();

  toggleDebugEnabled = () => {
    const {
      state,
      toggleDebugEnabled,
      toggleErrorEnabled
    } = this.props;
    if (state.errorOutputEnabled === true && state.debugOutputEnabled === false) {
      toggleErrorEnabled(false);
    }
    toggleDebugEnabled(!state.debugOutputEnabled);
  };

  toggleErrorEnabled = () => {
    const {
      state,
      toggleDebugEnabled,
      toggleErrorEnabled
    } = this.props;
    if (state.debugOutputEnabled === true && state.errorOutputEnabled === false) {
      toggleDebugEnabled(false);
    }
    toggleErrorEnabled(!state.errorOutputEnabled);
  };

  downloadReportZip = () => {
    this.dockerService
      .downloadReportZip()
      .then(response => {
        console.log('Response: ', response);
        return response;
      });
  };

  render() {

    const {
      buildInProgress,
      debugOutputEnabled,
      errorOutputEnabled,
      messages,
      stdErr,
      stdInput,
      serverErrorState
    } = this.props.state;

    return (
      <div className="jumbotron">
        <h1 className="display-3">Output:</h1>
        <div className="form-group">
          <div className="custom-control custom-switch">
            <input type="checkbox" className="custom-control-input" id="debugSwitch" checked={ debugOutputEnabled }
                   onChange={ this.toggleDebugEnabled }/>
            <label className="custom-control-label" htmlFor="debugSwitch">Show debug output</label>
          </div>
          <div className="custom-control custom-switch">
            <input type="checkbox" className="custom-control-input" id="errorSwitch" checked={ errorOutputEnabled }
                   onChange={ this.toggleErrorEnabled }/>
            <label className="custom-control-label" htmlFor="errorSwitch">Show errors</label>
          </div>
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary btn-lg inline" onClick={ this.downloadReportZip }>
            Download report
          </button>
          <button type="button" className="btn btn-primary btn-lg inline" data-toggle="tooltip" data-placement="top"
                  data-original-title="Clean all configuration files generated during tests">
            Clean configuration
          </button>
        </div>
        <Title
          debug={ debugOutputEnabled }
          error={ errorOutputEnabled }
          buildInProgress={ buildInProgress }
          serverErrorState={ serverErrorState }/>
        <ProgressBar show={ buildInProgress }/>
        <StandardOutput
          debug={ debugOutputEnabled }
          error={ errorOutputEnabled }
          messages={ messages }
          stdInput={ stdInput }
          stdErr={ stdErr }/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  toggleDebugEnabled: (isEnabled) => dispatch(toggleDebugEnabled(isEnabled)),
  toggleErrorEnabled: (isEnabled) => dispatch(toggleErrorEnabled(isEnabled)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);