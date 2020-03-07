import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { removeVariable, updateVariable, updateVariables } from "../../actions/settingsActions";

class ListVariables extends Component {

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

  removeVariable = (position) => {
    const { variables } = this.props.settings;
    const variable = variables[position];
    this.props.removeVariable(variable.id, variables);
  };

  updateVariable = (position) => {
    const { variables } = this.props.settings;
    const variable = variables[position];
    if (variable === undefined) {
      return;
    }
    if (this.props.validator(variable)) {
      this.props.updateVariable(variable, variables);
    }
  };

  render() {
    const {
      variables
    } = this.props.settings;

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  removeVariable: (id, variables) => dispatch(removeVariable(id, variables)),
  updateVariable: (variable, variables) => dispatch(updateVariable(variable, variables)),
  updateVariables: (variables) => dispatch(updateVariables(variables))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVariables);