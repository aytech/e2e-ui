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
import { downloadReportZip, removeNode } from "../../actions/outputActions";
import NodeStopModal from "./nodeStopModal";

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
            <Accordion.Toggle
              as={ Button }
              eventKey={ id }>
              { tag }
            </Accordion.Toggle>
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
            <Button className="node-refresh" onClick={ () => {
              this.props.fetchNode(id, nodes)
            } }>
              <FontAwesomeIcon
                icon={ faSyncAlt }
                spin={ isNodeUpdateProgress === true }/>
            </Button>
            }
            { status === "in progress" && stoppable &&
            <Button variant="warning" onClick={ () => {
              this.openStopNodeModal(id)
            } }>
              <FontAwesomeIcon icon={ faStopCircle }/>
            </Button>
            }
            { status === "complete" &&
            <Button variant="secondary" onClick={ () => {
              this.props.downloadReportZip(id)
            } }>
              <FontAwesomeIcon icon={ faDownload }/>
            </Button>
            }
            { status === "complete" &&
            <Button variant="danger" onClick={ () => {
              this.props.removeNode(id, nodes)
            } }>
              <FontAwesomeIcon icon={ faTrashAlt }/>
            </Button>
            }
          </Col>
        </Row>
        <NodeStopModal
          show={ isStopNodeModalOpen }
          onCancel={ this.closeModal }
          onOk={ () => {
            this.closeModal();
            this.props.stopNode(cancellingNodeId);
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
  removeNode: (nodeId, nodes) => dispatch(removeNode(nodeId, nodes))
});
export default connect(mapStateToProps, mapDispatchToProps)(NodeHeader);