import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import {
  updateDebugEnabled,
  updateErrorEnabled,
  updateReportLoading,
  updateStopProcessLoading
} from "../../actions/outputActions";
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
    const { updateReportLoading } = this.props;
    const { isReportAvailable } = this.props.state;
    updateReportLoading(true);
    if (isReportAvailable === true) {
      this.dockerService
        .downloadReportZip()
        .then(blob => {
          if (blob !== null) {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'e2e_report.zip';
            a.click();
          }
        })
        .finally(() => {
          updateReportLoading(false);
        });
    }
  };

  stopRunningProcess = () => {
    this.props.updateStopProcessLoading(true);
    this.dockerService
      .stopProcess()
      .then(data => {
        console.log("Data: ", data);
      })
      .finally(() => {
        this.props.updateStopProcessLoading(false);
      });
  };

  render() {

    const {
      buildInProgress,
      debugOutputEnabled,
      errorOutputEnabled,
      isReportAvailable,
      isReportLoading,
      isStopProcessLoading,
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
            loading={ isStopProcessLoading }
            text={ 'Stop test' }
            show={ !buildInProgress }
            onClick={ this.stopRunningProcess }/>
          <Button
            className="btn btn-primary btn-lg inline"
            loading={ isReportLoading }
            text={ 'Download report' }
            show={ isReportAvailable && !buildInProgress }
            onClick={ this.downloadReportZip }/>
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
  toggleDebugEnabled: (isEnabled) => dispatch(updateDebugEnabled(isEnabled)),
  toggleErrorEnabled: (isEnabled) => dispatch(updateErrorEnabled(isEnabled)),
  updateReportLoading: (isLoading) => dispatch(updateReportLoading(isLoading)),
  updateStopProcessLoading: (isLoading) => dispatch(updateStopProcessLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);