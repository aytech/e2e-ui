import React, { Component } from 'react';
import { connect } from "react-redux";
import './settings.css';
import Form from "react-bootstrap/Form";
import PageHeader from "../page-header/page-header";
import Container from "react-bootstrap/Container";
import {
  updateLoginError,
  updateLoginErrorMessage,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "../../actions/authActions";
import {
  saveSystemVariable,
  saveVariable,
  updateSystemKey,
  updateSystemType,
  updateSystemValue,
  updateSystemVariables,
  updateType,
  updateVariableKey,
  updateVariableValue
} from "../../actions/settingsActions";
import NewVariableForm from "./newVariableForm";
import ListVariables from "./listVariables";
import ListSystemVariables from "./listSystemVariables";

class Settings extends Component {

  onKeyChange = (event) => {
    this.props.updateVariableKey(event.target.value);
  };

  onSystemKeyChange = (event) => {
    this.props.updateSystemKey(event.target.value);
  };

  onSystemValueChange = (event) => {
    this.props.updateSystemValue(event.target.value);
  };

  onSystemTypeChange = (event) => {
    this.props.updateSystemType(event.target.value);
  };

  onTypeChange = (event) => {
    this.props.updateType(event.target.value);
  };

  onValueChange = (event) => {
    this.props.updateVariableValue(event.target.value);
  };

  createVariable = () => {
    const { key, value, type, variables } = this.props.settings;
    const variable = { key, value, type };
    if (this.isValidVariable(variable)) {
      this.props.saveVariable(variable, variables);
    }
  };

  createSystemVariable = () => {
    const { systemKey, systemValue, systemType, systemVariables } = this.props.settings;
    const variable = { key: systemKey, value: systemValue, type: systemType };
    if (this.isValidVariable(variable)) {
      this.props.saveSystemVariable(variable, systemVariables);
    }
  };

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
      key,
      systemKey,
      systemValue,
      systemVariables,
      value,
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
          <hr/>
          { system === true &&
            <ListSystemVariables validator={ this.isValidVariable }/>
          // <div className="system-vars list-group">
          //   { systemVariables.map((systemVariable, index) => (
          //     <span className="list-group-item list-group-item-action active" key={ index }>
          //       { systemVariable.key } : { systemVariable.value }
          //     </span>
          //   )) }
          // </div>
          }
          { system === true &&
          <NewVariableForm
            name={ systemKey }
            onKeyChange={ this.onSystemKeyChange }
            onKeyDown={ (event) => {
              if (event.key === 'Enter') {
                this.createSystemVariable();
              }
            } }
            onSubmit={ this.createSystemVariable }
            onTypeChange={ this.onSystemTypeChange }
            onValueChange={ this.onSystemValueChange }
            value={ systemValue }
          />
          }
          <h4>Custom variables</h4>
          <hr/>
          <Form>
            <ListVariables validator={ this.isValidVariable }/>
            <NewVariableForm
              name={ key }
              onKeyChange={ this.onKeyChange }
              onKeyDown={ (event) => {
                if (event.key === 'Enter') {
                  this.createVariable();
                }
              } }
              onSubmit={ this.createVariable }
              onTypeChange={ this.onTypeChange }
              onValueChange={ this.onValueChange }
              value={ value }
            />
          </Form>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  saveVariable: (variable, variables) => dispatch(saveVariable(variable, variables)),
  saveSystemVariable: (variable, variables) => dispatch(saveSystemVariable(variable, variables)),
  updateLoginError: (status) => dispatch(updateLoginError(status)),
  updateLoginErrorMessage: (message) => dispatch(updateLoginErrorMessage(message)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginWarn: (status) => dispatch(updateLoginWarn(status)),
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message)),
  updateSystemKey: (key) => dispatch(updateSystemKey(key)),
  updateSystemType: (type) => dispatch(updateSystemType(type)),
  updateSystemValue: (value) => dispatch(updateSystemValue(value)),
  updateType: (type) => dispatch(updateType(type)),
  updateSystemVariables: (variables) => dispatch(updateSystemVariables(variables)),
  updateVariableKey: (key) => dispatch(updateVariableKey(key)),
  updateVariableValue: (value) => dispatch(updateVariableValue(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);