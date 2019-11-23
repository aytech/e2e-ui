import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import { toggleDebugEnabled, toggleErrorEnabled } from "../../actions/outputActions";
import './output.css';
import DockerService from "../../services/DockerService";
import Button from "../button/button";

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
    if (this.props.state.isReportAvailable) {
      this.dockerService
        .downloadReportZip()
        .then(response => {
          if (response.status === 200) {
            return response.blob();
          }
          return null;
        })
        .then(blob => {
          if (blob !== null) {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'e2e_report.zip';
            a.click();
          }
        })
    }
  };

  cleanConfiguration = () => {
    console.log('Cleaning config');
  };

  render() {

    const {
      buildInProgress,
      debugOutputEnabled,
      errorOutputEnabled,
      isReportAvailable,
      messages,
      serverErrorState,
      stdErr,
      stdInput,
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
          <Button
            className="btn btn-primary btn-lg inline"
            text={ 'Download report' }
            onClick={ this.downloadReportZip }
            show={ isReportAvailable }/>
          <Button
            className="btn btn-primary btn-lg inline"
            text="Clean configuration"
            onClick={ this.cleanConfiguration }/>
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