import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import {
  updateCanBeStopped,
  updateModalOpen,
  updateReportLoading,
  updateStopProcessLoading
} from "../../actions/outputActions";
import './output.css';
import DockerService from "../../services/DockerService";
import Button from "../button/button";
import ModalDialog from "../modal/modal";
import OutputMode from "../output-mode/output-mode";

class Output extends Component {

  dockerService = new DockerService();

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
        <OutputMode/>
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
  updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status)),
  updateModalOpen: (isOpen) => dispatch(updateModalOpen(isOpen)),
  updateReportLoading: (isLoading) => dispatch(updateReportLoading(isLoading)),
  updateStopProcessLoading: (isLoading) => dispatch(updateStopProcessLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);