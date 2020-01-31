import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class PasswordReset extends Component {
  render() {
    return (
      <Container fluid={ true }>
        <Row>
          <Col>
            <Form>
              <div className="text-center mb-4">
                <img src="https://via.placeholder.com/80" alt=""/>
              </div>
              <Form.Group>
                <Form.Control
                  type="email"/>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"/>
              </Form.Group>
              <Form.Group>
                <Button variant="success" size="lg" block>
                  Reset password
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);