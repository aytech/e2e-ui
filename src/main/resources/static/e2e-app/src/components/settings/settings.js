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
import FormLabel from "react-bootstrap/FormLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageHeader from "../page-header/page-header";
import Container from "react-bootstrap/Container";

class Settings extends Component {

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

  render() {
    return (
      <React.Fragment>
        <PageHeader/>
        <Container>
          <h2>Settings</h2>
          <Form>
            { this.state.variables.map((variable, index) => (
              <Form.Group className="var-group" key={ index }>
                <Form.Row>
                  <Col xs={ 12 } sm={ 4 } md={ 4 } lg={ 3 }>
                    <FormGroup>
                      <FormLabel>
                        Variable name
                      </FormLabel>
                      <Form.Control
                        type="text"
                        value={ variable.name }
                        onChange={ (event) => {
                          this.onChangeVariableName(index, event)
                        } }/>
                    </FormGroup>
                  </Col>
                  <Col xs={ 12 } sm={ 8 } md={ 8 } lg={ 9 }>
                    <FormGroup>
                      <FormLabel>
                        Variable value
                      </FormLabel>
                      <Form.Control
                        type="text"
                        value={ variable.value }
                        onChange={ (event) => {
                          this.onChangeVariableValue(index, event)
                        } }/>
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