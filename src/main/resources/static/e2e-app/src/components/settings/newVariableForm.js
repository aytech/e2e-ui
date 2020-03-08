import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import {
  saveVariable,
  updateType,
  updateVariableKey,
  updateVariableValue
} from "../../actions/settingsActions";

class NewVariableForm extends Component {

  createVariable = () => {
    const { key, value, type, variables } = this.props.settings;
    const variable = { key, value, type };
    if (this.props.validator(variable)) {
      this.props.saveVariable(variable, variables);
    }
  };

  render() {
    const {
      key,
      types,
      value
    } = this.props.settings;

    return (
      <Form.Group className="var-group">
        <Form.Row>
          <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 3 }>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Variable name"
                value={ key }
                onChange={ (event) => {
                  this.props.updateVariableKey(event.target.value)
                } }/>
            </Form.Group>
          </Col>
          <Col xs={ 12 } sm={ 5 } md={ 4 } lg={ 5 }>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Variable value"
                value={ value }
                onChange={ (event) => {
                  this.props.updateVariableValue(event.target.value)
                } }
                onKeyDown={ (event) => {
                  if (event.key === 'Enter') {
                    this.createVariable();
                  }
                } }/>
            </Form.Group>
          </Col>
          <Col xs={ 12 } sm={ 3 } md={ 2 } lg={ 2 }>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={ (event) => {
                  this.props.updateType(event.target.value)
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
            <FormGroup>
              <Button variant="success" onClick={ this.createVariable }>
                <FontAwesomeIcon icon={ faPlusCircle }/>
              </Button>
            </FormGroup>
          </Col>
        </Form.Row>
      </Form.Group>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  saveVariable: (variable, variables) => dispatch(saveVariable(variable, variables)),
  updateType: (type) => dispatch(updateType(type)),
  updateVariableKey: (key) => dispatch(updateVariableKey(key)),
  updateVariableValue: (value) => dispatch(updateVariableValue(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewVariableForm);