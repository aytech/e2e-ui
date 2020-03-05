import React from 'react';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const NewVariableForm = (props) => {
  const {
    key,
    onKeyChange,
    onKeyDown,
    onSubmit,
    onTypeChange,
    onValueChange,
    value
  } = props;
  return (
    <Form.Group className="var-group">
      <Form.Row>
        <Col xs={ 12 } sm={ 3 } md={ 3 } lg={ 3 }>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Variable name"
              value={ key }
              onChange={ onKeyChange }
              onKeyDown={ onKeyDown }/>
          </Form.Group>
        </Col>
        <Col xs={ 12 } sm={ 5 } md={ 5 } lg={ 6 }>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Variable value"
              value={ value }
              onChange={ onValueChange }
              onKeyDown={ onKeyDown }/>
          </Form.Group>
        </Col>
        <Col xs={ 12 } sm={ 2 } md={ 2 } lg={ 2 }>
          <Form.Group>
            <Form.Control as="select" onChange={ onTypeChange }>
              <option value="text">text</option>
              <option value="email">email</option>
              <option value="password">password</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={ 12 } sm={ 2 } md={ 2 } lg={ 1 }>
          <FormGroup>
            <Button variant="success" onClick={ onSubmit }>
              <FontAwesomeIcon icon={ faPlusCircle }/>
            </Button>
          </FormGroup>
        </Col>
      </Form.Row>
    </Form.Group>
  );
};

export default NewVariableForm;