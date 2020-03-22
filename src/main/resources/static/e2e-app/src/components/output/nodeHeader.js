import React, { Component } from 'react';
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faStopCircle,
  faSyncAlt,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import {
  downloadReportZip,
  fetchNode,
  removeNode,
  stopNode
} from "../../actions/outputActions";
import NodeStopModal from "./nodeStopModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class NodeHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cancellingNodeId: null,
      isStopNodeModalOpen: false
    };
  }

  openStopNodeModal = (nodeId) => {
    this.setState(() => ({
      cancellingNodeId: nodeId,
      isStopNodeModalOpen: true
    }));
  };

  closeModal = () => {
    this.setState(() => ({
      isStopNodeModalOpen: false
    }));
  };

  getFormattedDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    const date = new Date(Date.parse(dateString));
    return date.toLocaleTimeString(window.navigator.language, options);
  };

  getToggleClassname = (nodeStatus) => {
    if (nodeStatus === "in progress") {
      return 'btn-warning';
    }
    return 'btn-success';
  };

  render() {
    const {
      isNodeUpdateProgress,
      nodes
    } = this.props.output;
    const {
      id,
      status,
      tag,
      stoppable,
      created
    } = this.props.node;
    const {
      cancellingNodeId,
      isStopNodeModalOpen
    } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 } className="text-center">
            <OverlayTrigger overlay={ <Tooltip id="tooltip-toggle">Click to toggle log output view</Tooltip> }>
              <Accordion.Toggle
                as={ Button }
                className={ this.getToggleClassname(status) }
                eventKey={ id }>
                { tag }
              </Accordion.Toggle>
            </OverlayTrigger>
          </Col>
          <Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 } className="text-center">
            <Badge variant={ (status === 'complete') ? 'success' : 'warning' }>
              { status }
            </Badge>
            <Badge variant="secondary">
              { this.getFormattedDate(created) }
            </Badge>
          </Col>
          <Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 } className="text-center node-actions">
            { status === "in progress" &&
            <OverlayTrigger overlay={ <Tooltip id="tooltip-refresh">Update status</Tooltip> }>
              <Button className="node-refresh" onClick={ () => {
                this.props.fetchNode(id, nodes)
              } }>
                <FontAwesomeIcon
                  icon={ faSyncAlt }
                  spin={ isNodeUpdateProgress === true }/>
              </Button>
            </OverlayTrigger>
            }
            { status === "in progress" && stoppable &&
            <OverlayTrigger overlay={ <Tooltip id="tooltip-stop">Stop test</Tooltip> }>
              <Button variant="warning" onClick={ () => {
                this.openStopNodeModal(id)
              } }>
                <FontAwesomeIcon icon={ faStopCircle }/>
              </Button>
            </OverlayTrigger>
            }
            { status === "complete" &&
            <OverlayTrigger overlay={ <Tooltip id="tooltip-download">Download test report</Tooltip> }>
              <Button variant="secondary" onClick={ () => {
                this.props.downloadReportZip(id)
              } }>
                <FontAwesomeIcon icon={ faDownload }/>
              </Button>
            </OverlayTrigger>
            }
            { status === "complete" &&
            <OverlayTrigger overlay={ <Tooltip id="tooltip-remove">Remove log</Tooltip> }>
              <Button variant="danger" onClick={ () => {
                this.props.removeNode(id, nodes)
              } }>
                <FontAwesomeIcon icon={ faTrashAlt }/>
              </Button>
            </OverlayTrigger>
            }
          </Col>
        </Row>
        <NodeStopModal
          show={ isStopNodeModalOpen }
          onCancel={ this.closeModal }
          onOk={ () => {
            this.closeModal();
            this.props.stopNode(cancellingNodeId, nodes);
          } }/>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  downloadReportZip: (nodeId) => dispatch(downloadReportZip(nodeId)),
  fetchNode: (nodeId, nodes) => dispatch(fetchNode(nodeId, nodes)),
  removeNode: (nodeId, nodes) => dispatch(removeNode(nodeId, nodes)),
  stopNode: (nodeId, nodes) => dispatch(stopNode(nodeId, nodes))
});
export default connect(mapStateToProps, mapDispatchToProps)(NodeHeader);