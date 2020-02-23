import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  faCog,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  fetchRunRequest,
  fetchStatus,
  updateCanBeStopped
} from "../../actions/runnerActions";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import './runner.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

class Runner extends Component {

  runE2E = () => {
    this.props.fetchRunRequest()
  };

  fetchStatus = () => {
    this.props.fetchStatus();
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { buildInProgress } = this.props.runner;

    return (
      <Jumbotron>
        <h1 className="display-3 text-center">
          Selenium Runner
        </h1>
        <Row>
          <Col>
            <Button
              variant="success"
              size="lg"
              className="runner"
              disabled={ !isAuthenticated || buildInProgress }
              onClick={ this.runE2E }
              block>
              <FontAwesomeIcon
                icon={ faCog }
                className={ (buildInProgress ? 'show' : 'hide') }
                spin/>
              <span className="animated-button-text">
                Run
              </span>
            </Button>
          </Col>
          <Col>
            <Button
              variant="info"
              size="lg"
              onClick={ this.fetchStatus }
              block>
              <FontAwesomeIcon icon={ faSyncAlt }/>
              <span className="animated-button-text">
                Refresh
              </span>
            </Button>
          </Col>
        </Row>
        <hr/>
        <p className={
          "lead text-center text-danger " + (buildInProgress ? 'show' : 'hide')
        }>
          Build in progress
        </p>
      </Jumbotron>
    )
  }
}

const
  mapStateToProps = state => ({
    ...state
  });
const
  mapDispatchToProps = dispatch => ({
    fetchRunRequest: (request) => dispatch(fetchRunRequest(request)),
    fetchStatus: () => dispatch(fetchStatus()),
    updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status))
  });

export default connect(mapStateToProps, mapDispatchToProps)(Runner);