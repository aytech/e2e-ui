import React, { Component } from 'react';
import {
  faEdit,
  faPlusCircle,
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
import SettingsService from "../../services/SettingsService";
import {
  updateLoginError,
  updateLoginErrorMessage,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "../../actions/authActions";
import { updateVariables } from "../../actions/stateActions";

class Settings extends Component {

  settingsService = new SettingsService();

  constructor(props) {
    super(props);
    this.state = {
      newKey: '',
      newValue: ''
    }
  }

  unauthorizedRequestRedirect = () => {
    this.props.updateLoginWarn(true);
    this.props.updateLoginModalStatus(true);
    this.props.updateLoginWarnMessage('Please login');
  };

  onChangeVariableName = (position, event) => {
    const { variables } = this.props.state;
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
    const { variables } = this.props.state;
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
    this.setState({ newKey: event.target.value })
  };

  onValueChange = (event) => {
    this.setState({ newValue: event.target.value })
  };

  createVariable = () => {
    const { newKey, newValue } = this.state;
    if (!this.validValue(newKey) || !this.validValue(newValue)) {
      return;
    }
    this.settingsService
      .createVariable(newKey, newValue)
      .then(response => {
        const { status, variable } = response;
        if (status === 200) {
          const { variables } = this.props.state;
          variables.push(variable);
          this.props.updateVariables(variables);
          this.setState({
            newKey: '',
            newValue: ''
          });
        }
        if (status === 401) {
          return this.unauthorizedRequestRedirect();
        }
      });
  };

  updateVariable = (position) => {
    const { variables } = this.props.state;
    const variable = variables[position];
    if (variable === undefined) {
      return;
    }
    const { id, key, value } = variable;
    if (!this.validValue(key) || !this.validValue(value)) {
      return;
    }
    this.settingsService
      .updateVariable(id, key, value)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          // No need to handle success, variable
          // was already updated during onChange
        }
        if (status === 401) {
          return this.unauthorizedRequestRedirect();
        }
      });
  };

  removeVariable = (position) => {
    const { variables } = this.props.state;
    const variable = variables[position];
    this.settingsService
      .removeVariable(variable.id)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          const newVariables = variables.filter(v => v.id === variable.id);
          this.props.updateVariables(newVariables);
        }
        if (status === 401) {
          return this.unauthorizedRequestRedirect();
        }
      });
  };

  validValue = (value) => {
    return value !== undefined && value.trim() !== '';
  };

  render() {
    const { variables } = this.props.state;
    return (
      <React.Fragment>
        <PageHeader/>
        <Container>
          <h1>Settings</h1>
          <hr/>
          <h3>Environment variables</h3>
          <p>
            <small className="form-text text-muted">
              Provided environment variables will be available when running tests
            </small>
          </p>
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
                          this.onChangeVariableName(index, event)
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
            <Form.Group className="var-group">
              <Form.Row>
                <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 3 }>
                  <FormGroup>
                    <Form.Control
                      type="text"
                      placeholder="Variable name"
                      value={ this.state.newKey }
                      onChange={ this.onKeyChange }/>
                  </FormGroup>
                </Col>
                <Col xs={ 12 } sm={ 5 } md={ 6 } lg={ 7 }>
                  <FormGroup>
                    <Form.Control
                      type="text"
                      placeholder="Variable value"
                      value={ this.state.newValue }
                      onChange={ this.onValueChange }/>
                  </FormGroup>
                </Col>
                <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 2 }>
                  <FormGroup>
                    <Button variant="success" onClick={ this.createVariable }>
                      <FontAwesomeIcon icon={ faPlusCircle }/>
                    </Button>
                  </FormGroup>
                </Col>
              </Form.Row>
            </Form.Group>
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
  updateLoginError: (status) => dispatch(updateLoginError(status)),
  updateLoginErrorMessage: (message) => dispatch(updateLoginErrorMessage(message)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginWarn: (status) => dispatch(updateLoginWarn(status)),
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message)),
  updateVariables: (variables) => dispatch(updateVariables(variables))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);