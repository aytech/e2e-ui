import React, { Component } from 'react';
import {
  faFolderPlus
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

class Settings extends Component {

  settingsService = new SettingsService();

  constructor(props) {
    super(props);
    this.state = {
      variables: [ {
        name: '',
        value: ''
      } ]
    }
  }

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

  saveVariable = (position) => {
    const variable = this.state.variables[position];
    if (variable === undefined) {
      return;
    }
    this.settingsService
      .saveVariable(variable.name, variable.value)
      .then(response => {
        console.log('Get response: ', response);
      });
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
                  <Col xs={ 12 } sm={ 4 } md={ 4 } lg={ 3 }>
                    <FormGroup>
                      <Form.Control
                        type="text"
                        placeholder="Variable name"
                        value={ variable.name }
                        onChange={ (event) => {
                          this.onChangeVariableName(index, event)
                        } }/>
                    </FormGroup>
                  </Col>
                  <Col xs={ 12 } sm={ 6 } md={ 6 } lg={ 8 }>
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
                  <Col xs={12} sm={2} md={2} lg={1}>
                    <FormGroup>
                      <Button variant="success" onClick={() => {
                        this.saveVariable(index)
                      }}>
                        Save
                      </Button>
                    </FormGroup>
                  </Col>
                </Form.Row>
              </Form.Group>
            )) }
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

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);