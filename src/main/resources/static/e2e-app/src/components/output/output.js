import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchNode } from "../../actions/outputActions";
import './output.css';
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Jumbotron from "react-bootstrap/Jumbotron";
import FilterToolbar from "./filterToolbar";
import NodeHeader from "./nodeHeader";
import LogOutput from "./logOutput";
import { NodeCategories } from "../../constants/application";
import Alert from "react-bootstrap/Alert";

class Output extends Component {

  getNoLogsTitle = (node) => {
    const filteredLogs = node.logs.filter(log => {
      const { passed, skipped, failed, debug } = node;
      const { category } = log;
      if (passed === true && category === NodeCategories.PASSED) {
        return true;
      }
      if (skipped === true && category === NodeCategories.SKIPPED) {
        return true;
      }
      if (failed === true && category === NodeCategories.FAILED) {
        return true;
      }
      return debug === true && category === NodeCategories.OTHER;
    });
    if (filteredLogs.length > 0) {
      return null;
    }
    return <p className="text-center text-danger">No logs found</p>;
  };

  getNoRunsAlert = (nodesCount) => {
    if (nodesCount < 1) {
      return (
        <Alert variant="warning" className="text-center">
          No recorded test results found
        </Alert>
      );
    }
    return null;
  };

  render() {

    const {
      nodes
    } = this.props.output;

    return (
      <Jumbotron>
        <h5 className="display-5">Recorded runs:</h5>
        { this.getNoRunsAlert(nodes.length) }
        <Accordion>
          { nodes.map(node => {
            const {
              id,
              logs
            } = node;
            return (
              <Card key={ id }>
                <Card.Header>
                  <NodeHeader node={ node }/>
                </Card.Header>
                <Accordion.Collapse eventKey={ id }>
                  <Card.Body>
                    <FilterToolbar node={ node }/>
                    { this.getNoLogsTitle(node) }
                    { logs.map(log => {
                      return <LogOutput key={ log.id } node={ node } log={ log }/>
                    }) }
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          }) }
        </Accordion>
      </Jumbotron>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchNode: (nodeId, nodes) => dispatch(fetchNode(nodeId, nodes))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);