import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  fetchNode,
  stopNode
} from "../../actions/outputActions";
import './output.css';
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Jumbotron from "react-bootstrap/Jumbotron";
import FilterToolbar from "./filterToolbar";
import NodeHeader from "./nodeHeader";
import LogOutput from "./logOutput";

class Output extends Component {

  render() {

    const {
      nodes
    } = this.props.output;

    return (
      <Jumbotron>
        <h5 className="display-5">Recorded runs:</h5>
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
                    { logs.map(log => {
                      return <LogOutput key={log.id} node={node} log={ log }/>
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
  fetchNode: (nodeId, nodes) => dispatch(fetchNode(nodeId, nodes)),
  stopNode: (nodeId) => dispatch(stopNode(nodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);