import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import {
  updateCanBeStopped,
  updateDebugEnabled,
  updateErrorEnabled,
  updateModalOpen,
  updateReportLoading,
  updateStopProcessLoading
} from "../../actions/outputActions";
import './output.css';
import DockerService from "../../services/DockerService";
import Button from "../button/button";
import ModalDialog from "../modal/modal";

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

  openModal = () => {
    this.props.updateModalOpen(true);
  };

  closeModal = () => {
    this.props.updateModalOpen(false);
  };

  downloadReportZip = () => {
    console.log('Report available: ', this.props.state.isReportAvailable);
    if (this.props.state.isReportAvailable === true) {
      this.props.updateReportLoading(true);
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
          this.props.updateReportLoading(false);
        });
    }
  };

  stopRunningProcess = () => {
    this.props.updateModalOpen(false);
    this.props.updateStopProcessLoading(true);
    this.dockerService
      .stopProcess()
      .finally(() => {
        this.props.updateCanBeStopped(false);
        this.props.updateStopProcessLoading(false);
      });
  };

  render() {

    const {
      buildInProgress,
      canProcessBeStopped,
      debugOutputEnabled,
      errorOutputEnabled,
      isReportAvailable,
      isReportLoading,
      isStopProcessLoading,
      messages,
      serverErrorState,
      stdErr,
      stdInput,
      isModalOpen
    } = this.props.state;

    const stopProcessText = isStopProcessLoading === true ? 'Stopping test' : 'Stop test';
    const downloadReportText = isReportLoading === true ? 'Downloading report' : 'Download report';

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
            text={ stopProcessText }
            show={ canProcessBeStopped === true && buildInProgress === true }
            onClick={ this.openModal }/>
          <Button
            className="btn btn-primary btn-lg inline"
            loading={ isReportLoading }
            text={ downloadReportText }
            show={ buildInProgress === false && isReportAvailable === true }
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
        <ModalDialog
          show={ isModalOpen }
          title="Confirm stop"
          body="Stop test? This will stop all running tests, report might be incomplete"
          actionText="Stop test"
          onCancel={ this.closeModal }
          onOk={ this.stopRunningProcess }/>
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
  updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status)),
  updateModalOpen: (isOpen) => dispatch(updateModalOpen(isOpen)),
  updateReportLoading: (isLoading) => dispatch(updateReportLoading(isLoading)),
  updateStopProcessLoading: (isLoading) => dispatch(updateStopProcessLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);