import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import StandardOutput from "../standard-output/standard-output";
import {
  downloadReportZip,
  fetchNode,
  fetchStopRunningProcess,
  removeNode,
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
  faDownload,
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
    const logView = (logLine) => {
      const { id, level, category, log } = logLine;
      if (level !== 'INFO') {
        return null;
      }
      switch (category) {
        case 'FAILED':
          return <p key={ id } className="text-danger">{ log }</p>;
        case 'SKIPPED':
          return <p key={ id } className="text-warning">{ log }</p>;
        case 'PASSED':
          return <p key={ id } className="text-success">{ log }</p>;
        default:
          return <p key={ id } className="text-info">{ log }</p>;
      }
    };
    const nodeView = (node) => {
      const { id, status, logs, created } = node;
      return (
        <Card key={ id }>
          <Card.Header>
            <Accordion.Toggle
              as={ Button }
              variant="link"
              eventKey={ id }>
              { node.tag }
            </Accordion.Toggle>
            <Badge variant="light">{ status }</Badge>
            <Badge variant="light">{ created }</Badge>
            { node.status === "in progress" &&
            <Button className="node-refresh" onClick={ () => {
              this.props.fetchNode(id, nodes)
            } }>
              <FontAwesomeIcon
                icon={ faSyncAlt }
                spin={ isNodeUpdateProgress === true }/>
            </Button>
            }
            <Button className="fa-pull-right" onClick={ () => {
              this.props.downloadReportZip(id)
            } }>
              <FontAwesomeIcon icon={ faDownload }/>
            </Button>
            <Button className="fa-pull-right" onClick={ () => {
              this.props.removeNode(id, nodes)
            } }>
              <FontAwesomeIcon icon={ faTrashAlt }/>
            </Button>
          </Card.Header>
          <Accordion.Collapse eventKey={ id }>
            <Card.Body>
              { logs.map(logView) }
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };

    return (
      <div className="jumbotron">
        <h5 className="display-5">Recorded runs:</h5>
        <Accordion>
          { nodes.map(nodeView) }
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
  downloadReportZip: (nodeId) => dispatch(downloadReportZip(nodeId)),
  fetchNode: (nodeId, nodes) => dispatch(fetchNode(nodeId, nodes)),
  fetchStopRunningProcess: () => dispatch(fetchStopRunningProcess()),
  updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status)),
  updateModalOpen: (isOpen) => dispatch(updateModalOpen(isOpen)),
  removeNode: (nodeId, nodes) => dispatch(removeNode(nodeId, nodes)),
  updateReportLoading: (isLoading) => dispatch(updateReportLoading(isLoading)),
  updateStopProcessLoading: (isLoading) => dispatch(updateStopProcessLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);