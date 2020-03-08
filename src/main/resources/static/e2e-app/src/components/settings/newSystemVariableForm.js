import React, { Component } from 'react';
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  saveSystemVariable,
  updateSystemKey,
  updateSystemType,
  updateSystemValue
} from "../../actions/settingsActions";

class NewSystemVariableForm extends Component {

  createSystemVariable = () => {
    const { systemKey, systemValue, systemType, systemVariables } = this.props.settings;
    const variable = { key: systemKey, value: systemValue, type: systemType };
    if (this.props.validator(variable)) {
      this.props.saveSystemVariable(variable, systemVariables);
    }
  };

  render() {
    const {
      systemKey,
      systemValue,
      types
    } = this.props.settings;

    return (
      <Form.Group className="var-group">
        <Form.Row>
          <Col xs={ 12 } sm={ 4 } md={ 3 } lg={ 3 }>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Variable name"
                value={ systemKey }
                onChange={ (event) => {
                  this.props.updateSystemKey(event.target.value)
                } }/>
            </Form.Group>
          </Col>
          <Col xs={ 12 } sm={ 5 } md={ 3 } lg={ 5 }>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Variable value"
                value={ systemValue }
                onChange={ (event) => {
                  this.props.updateSystemValue(event.target.value)
                } }
                onKeyDown={ (event) => {
                  if (event.key === 'Enter') {
                    this.createSystemVariable()
                  }
                } }/>
            </Form.Group>
          </Col>
          <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 2 }>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={ (event) => {
                  this.props.updateSystemType(event.target.value)
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
              <Button variant="success" onClick={ this.createSystemVariable }>
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
  saveSystemVariable: (variable, variables) => dispatch(saveSystemVariable(variable, variables)),
  updateSystemKey: (key) => dispatch(updateSystemKey(key)),
  updateSystemType: (type) => dispatch(updateSystemType(type)),
  updateSystemValue: (value) => dispatch(updateSystemValue(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSystemVariableForm);