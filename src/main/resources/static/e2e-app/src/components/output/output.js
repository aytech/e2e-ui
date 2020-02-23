import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import StandardOutput from "../standard-output/standard-output";
import {
  fetchNode,
  fetchNodeStatus,
  fetchStopRunningProcess, removeNode,
  updateCanBeStopped,
  updateModalOpen,
  updateReportLoading,
  updateStopProcessLoading
} from "../../actions/outputActions";
import './output.css';
import DockerService from "../../services/DockerService";
import ModalDialog from "../modal/modal";
import OutputMode from "../output-mode/output-mode";
import OutputSort from "../output-sort/output-sort";
import OutputTitle from "../output-title/output-title";
import DateFormat from "../date-format/date-format";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import AppButton from "../app-button/app-button";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Button from "react-bootstrap/Button";

class Output extends Component {

  dockerService = new DockerService();

  openModal = () => {
    this.props.updateModalOpen(true);
  };

  closeModal = () => {
    this.props.updateModalOpen(false);
  };

  downloadReportZip = () => {
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
    this.props.fetchStopRunningProcess();
  };

  render() {

    const {
      buildInProgress,
      canProcessBeStopped,
      isReportAvailable,
      isReportLoading,
      isStopProcessLoading,
      isModalOpen
    } = this.props.runner;
    const {
      isNodeUpdateProgress,
      nodes
    } = this.props.output;
    const stopProcessText = isStopProcessLoading === true ? 'Stopping test' : 'Stop test';
    const downloadReportText = isReportLoading === true ? 'Downloading report' : 'Download report';

    return (
      <div className="jumbotron">
        <h5 className="display-5">Recorded runs:</h5>
        <Accordion>
          { nodes.map(node =>
            <Card key={ node.id }>
              <Card.Header>
                <Accordion.Toggle
                  as={ Button }
                  variant="link"
                  eventKey={ node.id }>
                  { node.tag }
                </Accordion.Toggle>
                <Badge variant="light">{ node.status }</Badge>
                { node.status === "in progress" &&
                <Button className="node-refresh" onClick={ () => {
                  this.props.fetchNode(node.id, nodes)
                } }>
                  <FontAwesomeIcon icon={ faSyncAlt } spin={ isNodeUpdateProgress === true }/>
                </Button>
                }
                <Button className="fa-pull-right" onClick={ () => {
                  this.props.removeNode(node.id, nodes)
                } }>
                  <FontAwesomeIcon icon={ faTrashAlt }/>
                </Button>
              </Card.Header>
              <Accordion.Collapse eventKey={ node.id }>
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          ) }
        </Accordion>
        <OutputMode/>
        <div className="form-group">
          <AppButton
            className="btn btn-primary btn-lg inline"
            loading={ isStopProcessLoading }
            text={ stopProcessText }
            show={ canProcessBeStopped === true && buildInProgress === true }
            onClick={ this.openModal }/>
          <AppButton
            className="btn btn-primary btn-lg inline"
            loading={ isReportLoading }
            text={ downloadReportText }
            show={ buildInProgress === false && isReportAvailable === true }
            onClick={ this.downloadReportZip }/>
        </div>
        <OutputTitle/>
        <DateFormat/>
        <OutputSort/>
        <ProgressBar show={ buildInProgress }/>
        <StandardOutput/>
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
  fetchNode: (nodeId, nodes) => dispatch(fetchNode(nodeId, nodes)),
  fetchStopRunningProcess: () => dispatch(fetchStopRunningProcess()),
  updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status)),
  updateModalOpen: (isOpen) => dispatch(updateModalOpen(isOpen)),
  removeNode: (nodeId, nodes) => dispatch(removeNode(nodeId, nodes)),
  updateReportLoading: (isLoading) => dispatch(updateReportLoading(isLoading)),
  updateStopProcessLoading: (isLoading) => dispatch(updateStopProcessLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);