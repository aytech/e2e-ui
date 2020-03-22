import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
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

  onChangeVariableType = (position, event) => {
    const { variables } = this.props.settings;
    variables.every((variable, index) => {
      if (position === index) {
        variable.type = event.target.value;
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
      types,
      variables
    } = this.props.settings;

    return (
      <React.Fragment>
        { variables.map((variable, index) => (
          <Form.Group className="var-group" key={ index }>
            <Form.Row>
              <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 3 }>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Variable name"
                    value={ variable.key }
                    onChange={ (event) => {
                      this.onChangeVariableKey(index, event)
                    } }/>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 5 } md={ 4 } lg={ 5 }>
                <Form.Group>
                  <Form.Control
                    type={ variable.type }
                    placeholder="Variable value"
                    value={ variable.value }
                    onChange={ (event) => {
                      this.onChangeVariableValue(index, event)
                    } }/>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 3 } md={ 2 } lg={ 2 }>
                <Form.Group>
                  <Form.Control
                    as="select"
                    value={ variable.type }
                    onChange={ (event) => {
                      this.onChangeVariableType(index, event)
                    } }>
                    { types.map((type, idx) => (
                      <option
                        value={ type }
                        key={ idx }>
                        { type }
                      </option>
                    )) }
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 12 } md={ 3 } lg={ 2 } className="text-center">
                <Form.Group>
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
                </Form.Group>
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
  updateVariable: (variable) => dispatch(updateVariable(variable)),
  updateVariables: (variables) => dispatch(updateVariables(variables))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVariables);