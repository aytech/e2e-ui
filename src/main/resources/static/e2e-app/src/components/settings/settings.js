import React, { Component } from 'react';
import {
  faEdit,
  faFolderPlus,
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

class Settings extends Component {

  settingsService = new SettingsService();

  constructor(props) {
    super(props);
    this.state = {
      newKey: '',
      newValue: '',
      variables: []
    }
  }

  componentDidMount() {
    this.settingsService
      .getSettings()
      .then(response => {
        const { status, variables } = response;
        if (status === 200) {
          this.setState({ variables });
        }
        if (status === 401) {
          return this.unauthorizedRequestRedirect();
        }
      });
  }

  unauthorizedRequestRedirect = () => {
    this.props.updateLoginWarn(true);
    this.props.updateLoginModalStatus(true);
    this.props.updateLoginWarnMessage('Please login');
    return this.props.history.push('/');
  };

  addVariableField = () => {
    const variables = this.state.variables;
    variables.push({
      name: '',
      value: ''
    });
    this.setState({ variables });
  };

  onChangeVariableName = (position, event) => {
    const variables = this.state.variables.map((variable, index) => {
      if (position === index) {
        variable.name = event.target.value;
      }
      return variable;
    });
    this.setState({ variables: variables })
  };

  onChangeVariableValue = (position, event) => {
    const variables = this.state.variables.map((variable, index) => {
      if (position === index) {
        variable.value = event.target.value;
      }
      return variable;
    });
    this.setState({ variables: variables })
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
          const { variables } = this.state;
          variables.push(variable);
          this.setState({
            newKey: '',
            newValue: '',
            variables
          });
        }
        if (status === 401) {
          return this.unauthorizedRequestRedirect();
        }
      });
  };

  updateVariable = (position) => {
    const variable = this.state.variables[position];
    console.log('updating variable: ', variable);
  };

  removeVariable = (position) => {
    const variable = this.state.variables[position];
    this.settingsService
      .removeVariable(variable.id)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          const { variables } = this.state;
          this.setState({
            variables: variables.filter(element => element.id !== variable.id)
          })
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
            { this.state.variables.map((variable, index) => (
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
                  <Col xs={ 12 } sm={ 5 } md={ 5 } lg={ 7 }>
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
                  <Col xs={ 12 } sm={ 4 } md={ 4 } lg={ 2 }>
                    <FormGroup>
                      <Button variant="success" onClick={ () => {
                        this.updateVariable(index)
                      } }>
                        <FontAwesomeIcon icon={ faEdit }/>
                      </Button>
                      <Button variant="success" onClick={ () => {
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
                <Col xs={ 12 } sm={ 4 } md={ 4 } lg={ 3 }>
                  <FormGroup>
                    <Form.Control
                      type="text"
                      placeholder="Variable name"
                      value={ this.state.newKey }
                      onChange={ this.onKeyChange }/>
                  </FormGroup>
                </Col>
                <Col xs={ 12 } sm={ 6 } md={ 6 } lg={ 8 }>
                  <FormGroup>
                    <Form.Control
                      type="text"
                      placeholder="Variable value"
                      value={ this.state.newValue }
                      onChange={ this.onValueChange }/>
                  </FormGroup>
                </Col>
                <Col xs={ 12 } sm={ 2 } md={ 2 } lg={ 1 }>
                  <FormGroup>
                    <Button variant="success" onClick={ this.createVariable }>
                      <FontAwesomeIcon icon={ faPlusCircle }/>
                    </Button>
                  </FormGroup>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Button variant="success" onClick={ this.addVariableField }>
                <FontAwesomeIcon icon={ faFolderPlus }/> Add variable
              </Button>
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
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);