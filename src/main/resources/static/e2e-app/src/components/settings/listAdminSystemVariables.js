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

class ListAdminSystemVariables extends Component {

  onChangeVariableKey = (position, event) => {
    const { systemVariables } = this.props.settings;
    systemVariables.every((variable, index) => {
      if (position === index) {
        variable.key = event.target.value;
        return false;
      }
      return true;
    });
    this.props.updateSystemVariables(systemVariables);
  };

  onChangeVariableValue = (position, event) => {
    const { systemVariables } = this.props.settings;
    systemVariables.every((variable, index) => {
      if (position === index) {
        variable.value = event.target.value;
        return false;
      }
      return true;
    });
    this.props.updateSystemVariables(systemVariables);
  };

  onChangeVariableType = (position, event) => {
    const { systemVariables } = this.props.settings;
    systemVariables.every((variable, index) => {
      if (position === index) {
        variable.type = event.target.value;
        return false;
      }
      return true;
    });
    this.props.updateSystemVariables(systemVariables);
  };

  updateVariable = (position) => {
    const { systemVariables } = this.props.settings;
    const variable = systemVariables[position];
    if (variable === undefined) {
      return;
    }
    if (this.props.validator(variable)) {
      this.props.updateSystemVariable(variable, systemVariables);
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

  render() {
    const {
      systemVariables,
      types
    } = this.props.settings;

    return (
      <React.Fragment>
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
                      this.onChangeVariableKey(index, event)
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
                      this.onChangeVariableValue(index, event)
                    } }/>
                </Form.Group>
              </Col>
              <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 2 }>
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