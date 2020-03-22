import React, { Component } from 'react';
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  removeSystemVariable,
  updateSystemVariable,
  updateSystemVariables
} from "../../actions/settingsActions";
import { Prompt } from "react-router";

class ListAdminSystemVariables extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modifiedVariableId: -1
    }
  }

  getVariable = (id) => {
    const { systemVariables } = this.props.settings;
    return systemVariables.find(variable => variable.id === id);
  };

  updateVariable = (variable) => {
    const { systemVariables } = this.props.settings;
    const variables = systemVariables.map(element => {
      if (element.id === variable.id) {
        return variable;
      }
      return element;
    });
    this.props.updateSystemVariables(variables);
    this.setState({ modifiedVariableId: variable.id });
  };

  onChangeVariableKey = (id, event) => {
    const variable = this.getVariable(id);
    if (variable !== undefined) {
      variable.key = event.target.value;
      this.updateVariable(variable);
    }
  };

  onChangeVariableValue = (id, event) => {
    const variable = this.getVariable(id);
    if (variable !== undefined) {
      variable.value = event.target.value;
      this.updateVariable(variable);
    }
  };

  onChangeVariableType = (id, event) => {
    const { types } = this.props.settings;
    const variable = this.getVariable(id);
    const isValidType = types.indexOf(event.target.value) !== -1;
    if (variable !== undefined && isValidType === true) {
      variable.type = event.target.value;
      this.updateVariable(variable);
    }
  };

  removeVariable = (position) => {
    const { systemVariables } = this.props.settings;
    const variable = systemVariables[position];
    if (variable === undefined) {
      return;
    }
    this.props.removeSystemVariable(variable.id, systemVariables);
  };

  getEditButton = (index, variable) => {
    const { modifiedVariableId } = this.state;
    const modified = modifiedVariableId === variable.id;
    const variant = modified ? 'warning' : 'light';
    return (
      <Button variant={ variant } onClick={ () => {
        this.setState({ modifiedVariableId: -1 });
        this.props.updateSystemVariable(variable)
      } } disabled={ modified === false }>
        <FontAwesomeIcon icon={ faEdit }/>
      </Button>
    );
  };

  render() {
    const {
      systemVariables,
      types
    } = this.props.settings;
    const { modifiedVariableId } = this.state;

    return (
      <React.Fragment>
        <Prompt
          when={ modifiedVariableId !== -1 }
          message="Discard unsaved changes?"/>
        { systemVariables.map((variable, index) => (
          <Form.Group className="var-group" key={ index }>
            <Form.Row>
              <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 3 }>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Variable name"
                    value={ variable.key }
                    onChange={ (event) => {
                      this.onChangeVariableKey(variable.id, event)
                    } }/>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 5 } md={ 3 } lg={ 5 }>
                <Form.Group>
                  <Form.Control
                    type={ variable.type }
                    placeholder="Variable value"
                    value={ variable.value }
                    onChange={ (event) => {
                      this.onChangeVariableValue(variable.id, event)
                    } }/>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 2 }>
                <Form.Group>
                  <Form.Control
                    as="select"
                    value={ variable.type }
                    onChange={ (event) => {
                      this.onChangeVariableType(variable.id, event)
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
                  { this.getEditButton(index, variable) }
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
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  removeSystemVariable: (id, variables) => dispatch(removeSystemVariable(id, variables)),
  updateSystemVariable: (variable) => dispatch(updateSystemVariable(variable)),
  updateSystemVariables: (variables) => dispatch(updateSystemVariables(variables))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListAdminSystemVariables);