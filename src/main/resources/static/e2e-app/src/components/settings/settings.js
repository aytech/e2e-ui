import React, { Component } from 'react';
import { connect } from "react-redux";
import './settings.css';
import Form from "react-bootstrap/Form";
import PageHeader from "../page-header/page-header";
import Container from "react-bootstrap/Container";
import NewVariableForm from "./newVariableForm";
import ListVariables from "./listVariables";
import ListAdminSystemVariables from "./listAdminSystemVariables";
import ListSystemVariables from "./listSystemVariables";
import NewSystemVariableForm from "./newSystemVariableForm";

class Settings extends Component {

  valueNotEmpty = (value) => {
    return value !== undefined && value.trim() !== '';
  };

  isValidVariable = (variable) => {
    const { key, value, type } = variable;
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      default:
        return this.valueNotEmpty(key) && this.valueNotEmpty(value)
    }
  };

  render() {
    const {
      system
    } = this.props.settings;

    return (
      <React.Fragment>
        <PageHeader/>
        <Container>
          <h1>Settings</h1>
          <hr/>
          <h3>Environment variables</h3>
          <p className="text-info">
            <small className="form-text">
              Provided environment variables will be available when running tests
            </small>
          </p>
          <hr/>
          <h4>System variables</h4>
          <p className="text-info">
            <small className="form-text">
              System wide variables. Custom variables with the same name will override system environments
            </small>
          </p>
          { system === true &&
          <ListAdminSystemVariables validator={ this.isValidVariable }/>
          }
          { system === true &&
          <NewSystemVariableForm validator={ this.isValidVariable }/>
          }
          { system === false &&
          <ListSystemVariables/>
          }
          <hr/>
          <h4>Custom variables</h4>
          <Form>
            <ListVariables validator={ this.isValidVariable }/>
            <NewVariableForm validator={ this.isValidVariable }/>
          </Form>
          <hr/>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);