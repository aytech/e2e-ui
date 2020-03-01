import React, { Component } from 'react';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { connect } from "react-redux";
import { updateNodes } from "../../actions/outputActions";
import './output.css';

class FilterToolbar extends Component {

  constructor(props) {
    super(props);
    const { nodes } = this.props.output;
    const { node } = this.props;
    this.props.updateNodes(nodes.map(item => {
      if (node.id === item.id) {
        item.passed = true;
        item.skipped = true;
        item.failed = true;
        item.debug = false;
      }
      return item;
    }));
  }

  toggleNodeView = (nodeId, attribute) => {
    const { nodes } = this.props.output;
    this.props.updateNodes(nodes.map(node => {
      if (node.id === nodeId) {
        node[attribute] = node[attribute] !== true;
      }
      return node;
    }));
  };

  render() {
    const {
      id,
      passed,
      skipped,
      failed,
      debug
    } = this.props.node;

    return (
      <ButtonToolbar className="justify-content-center filter-toolbar">
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-passed">
              Passed tests
            </Tooltip>
          }>
          <Button variant="link" onClick={ () => {
            this.toggleNodeView(id, 'passed')
          } }>
            <FontAwesomeIcon
              icon={ faCheckCircle }
              size="2x"
              className={ (passed === true) ? 'text-success' : '' }/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-skipped">
              Skipped tests
            </Tooltip>
          }>
          <Button variant="link" onClick={ () => {
            this.toggleNodeView(id, 'skipped')
          } }>
            <FontAwesomeIcon
              icon={ faExclamationTriangle }
              size="2x"
              className={ (skipped === true) ? 'text-success' : '' }/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-failed">
              Failed tests
            </Tooltip>
          }>
          <Button variant="link" onClick={ () => {
            this.toggleNodeView(id, 'failed')
          } }>
            <FontAwesomeIcon
              icon={ faExclamationCircle }
              size="2x"
              className={ (failed === true) ? 'text-success' : '' }/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-debug">
              Debug output
            </Tooltip>
          }>
          <Button variant="link" onClick={ () => {
            this.toggleNodeView(id, 'debug')
          } }>
            <FontAwesomeIcon
              icon={ faBug }
              size="2x"
              className={ (debug === true) ? 'text-success' : '' }/>
          </Button>
        </OverlayTrigger>
      </ButtonToolbar>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  updateNodes: (nodes) => dispatch(updateNodes(nodes))
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterToolbar);