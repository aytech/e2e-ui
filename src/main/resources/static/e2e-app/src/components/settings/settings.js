import React, { Component } from 'react';
import {
  faEdit,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { connect } from "react-redux";
import './settings.css';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  removeVariable,
  saveVariable,
  updateSystemKey,
  updateSystemType,
  updateSystemValue,
  updateSystemVariables,
  updateType,
  updateVariable,
  updateVariableKey,
  updateVariables,
  updateVariableValue
} from "../../actions/settingsActions";
import NewVariableForm from "./newVariableForm";

class Settings extends Component {

  onChangeVariableKey = (position, event) => {
    const { variables } = this.props.settings;
    variables.every((variable, index) => {
      if (position === index) {
        variable.key = event.target.value;
        return false;
      }
      return true;
    });
    this.props.updateVariables(variables);
  };

  onChangeVariableValue = (position, event) => {
    const { variables } = this.props.settings;
    variables.every((variable, index) => {
      if (position === index) {
        variable.value = event.target.value;
        return false;
      }
      return true;
    });
    this.props.updateVariables(variables);
  };

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
    const { key, value, variables } = this.props.settings;
    if (this.validValue(key) && this.validValue(value)) {
      this.props.saveVariable(key, value, variables);
    }
  };

  createSystemVariable = () => {
    console.log('Creating system variable');
  };

  updateVariable = (position) => {
    const { variables } = this.props.settings;
    const variable = variables[position];
    if (variable === undefined) {
      return;
    }
    const { id, key, value } = variable;
    if (!this.validValue(key) || !this.validValue(value)) {
      return;
    }
    this.props.updateVariable(id, key, value);
  };

  removeVariable = (position) => {
    const { variables } = this.props.settings;
    const variable = variables[position];
    this.props.removeVariable(variable.id, variables);
  };

  validValue = (value) => {
    return value !== undefined && value.trim() !== '';
  };

  render() {
    const {
      key,
      systemKey,
      systemValue,
      systemVariables,
      value,
      variables,
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
          { system === false &&
          <div className="system-vars list-group">
            { systemVariables.map((systemVariable, index) => (
              <span className="list-group-item list-group-item-action active" key={ index }>
                { systemVariable.key } : { systemVariable.value }
              </span>
            )) }
          </div>
          }
          { system === true &&
          <NewVariableForm
            key={ systemKey }
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
            { variables.map((variable, index) => (
              <Form.Group className="var-group" key={ index }>
                <Form.Row>
                  <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 3 }>
                    <FormGroup>
                      <Form.Control
                        type="text"
                        placeholder="Variable name"
                        value={ variable.key }
                        onChange={ (event) => {
                          this.onChangeVariableKey(index, event)
                        } }/>
                    </FormGroup>
                  </Col>
                  <Col xs={ 12 } sm={ 5 } md={ 6 } lg={ 7 }>
                    <FormGroup>
                      <Form.Control
                        type="text"
                        placeholder="Variable value"
                        value={ variable.value }
                        onChange={ (event) => {
                          this.onChangeVariableValue(index, event)
                        } }/>
                    </FormGroup>
                  </Col>
                  <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 2 }>
                    <FormGroup>
                      <Button variant="warning" onClick={ () => {
                        this.updateVariable(index)
                      } }>
                        <FontAwesomeIcon icon={ faEdit }/>
                      </Button>
                      <Button variant="danger" onClick={ () => {
                        this.removeVariable(index)
                      } }>
                        <FontAwesomeIcon icon={ faTrashAlt }/>
                      </Button>
                    </FormGroup>
                  </Col>
                </Form.Row>
              </Form.Group>
            )) }
            <NewVariableForm
              key={ key }
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
  removeVariable: (id, variables) => dispatch(removeVariable(id, variables)),
  saveVariable: (key, value, variables) => dispatch(saveVariable(key, value, variables)),
  updateLoginError: (status) => dispatch(updateLoginError(status)),
  updateLoginErrorMessage: (message) => dispatch(updateLoginErrorMessage(message)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginWarn: (status) => dispatch(updateLoginWarn(status)),
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message)),
  updateSystemKey: (key) => dispatch(updateSystemKey(key)),
  updateSystemType: (type) => dispatch(updateSystemType(type)),
  updateSystemValue: (value) => dispatch(updateSystemValue(value)),
  updateType: (type) => dispatch(updateType(type)),
  updateVariable: (id, key, value) => dispatch(updateVariable(id, key, value)),
  updateVariables: (variables) => dispatch(updateVariables(variables)),
  updateSystemVariables: (variables) => dispatch(updateSystemVariables(variables)),
  updateVariableKey: (key) => dispatch(updateVariableKey(key)),
  updateVariableValue: (value) => dispatch(updateVariableValue(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);