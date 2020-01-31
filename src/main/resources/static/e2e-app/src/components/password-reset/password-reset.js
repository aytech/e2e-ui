import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './password-reset.css';
import AuthenticationService from "../../services/AuthenticationService";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Redirect } from "react-router";

class PasswordReset extends Component {

  authenticationService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      isError: false,
      isLoading: false,
      password: ''
    }
  }

  onEmailChange = (event) => {
    this.setState({
      email: event.target.value
    })
  };

  onPasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  };

  isValidForm = () => {
    const { email, password } = this.state;
    if (/\S+@\S+\.\S+/.test(email) === false) {
      this.setState({
        errorMessage: 'Please enter valid email address',
        isError: true,
      });
      return false;
    }
    if (password === undefined || password.trim() === '') {
      this.setState({
        errorMessage: 'Enter your password',
        isError: true,
      });
      return false;
    }
    return true;
  };

  onSubmit = () => {
    if (this.isValidForm() !== true) {
      return;
    }
    this.setState({
      isError: false,
      isLoading: true
    });
    const { code } = this.props.match.params;
    const { email, password } = this.state;
    this.authenticationService
      .resetPassword(email, password, code)
      .then(response => {
        const { status } = response;
        if (status === 404) {
          this.setState({
            isError: true,
            errorMessage: 'User not found'
          })
        }
        if (status === 200) {
          return <Redirect to="/"/>
        }
      })
      .finally(() => {
        this.setState({
          isLoading: false
        })
      });
  };

  render() {
    return (
      <Container fluid={ true }>
        <Row className="row-reset">
          <Col>
            <Form>
              <div className="text-center mb-4">
                <img src="https://via.placeholder.com/80" alt=""/>
              </div>
              <Form.Group>
                <Form.Control
                  type="email"
                  value={ this.state.email }
                  onChange={ this.onEmailChange }/>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  value={ this.state.password }
                  onChange={ this.onPasswordChange }/>
              </Form.Group>
              <Form.Group>
              { this.state.isError === true &&
              <Alert variant="danger">
                { this.state.errorMessage }
              </Alert>
              }
              { this.state.isLoading === true &&
              <ProgressBar variant="success" now={ 100 } animated/>
              }
              </Form.Group>
              <Form.Group>
                <Button
                  variant="success"
                  size="lg"
                  block
                  onClick={ this.onSubmit }>
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