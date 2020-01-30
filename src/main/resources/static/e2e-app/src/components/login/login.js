import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  updateAuthenticatedStatus,
  updateLoginSuccess,
  updateLoginSuccessMessage,
  updateUserEmail,
  updateUserPassword
} from "../../actions/authActions";
import Modal from "react-bootstrap/Modal";
import { updateLoginModalStatus } from "../../actions/authActions";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faRedoAlt,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import AuthenticationService from "../../services/AuthenticationService";
import ProgressBar from "react-bootstrap/ProgressBar";
import './login.css';

class Login extends Component {

  authService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isError: false,
      isLoading: false
    };
  }

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  onHide = () => {
    this.props.updateLoginModalStatus(false);
  };

  sendSignInRequest = (email, password) => {
    this.authService
      .login(email, password)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          this.props.updateAuthenticatedStatus(true);
          this.props.updateLoginModalStatus(false);
        }
        if (status === 401) {
          this.setState({
            errors: [ 'Login failed, try to reset password or sign up' ],
            isError: true
          });
        }
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  sendSignUpRequest = (email, password) => {
    this.authService
      .register(email, password)
      .then(response => {
        const { errors, status } = response;
        if (status === 200) {
          this.setState({
            errors: [],
            isError: false
          });
          this.props.updateLoginSuccess(true);
          this.props.updateLoginSuccessMessage(
            'Success, please check email to activate the new profile'
          );
        } else {
          this.setState({
            errors: errors,
            isError: true
          });
          this.props.updateLoginSuccess(false);
        }
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  signIn = () => {
    const { email, password } = this.props.auth;
    const errors = this.getValidationErrors();
    if (errors.length === 0) {
      this.setState({ isLoading: true });
      this.sendSignInRequest(email, password);
    }
  };

  signUp = () => {
    this.setState({ isLoading: true });
    const { email, password } = this.props.auth;
    const errors = this.getValidationErrors();
    if (errors.length === 0) {
      this.sendSignUpRequest(email, password);
    }
  };

  getValidationErrors = () => {
    const { email, password } = this.props.auth;
    let errors = [];
    if (/\S+@\S+\.\S+/.test(email) === false) {
      errors.push('Please enter valid email address');
    }
    if (password === undefined || password.trim() === '') {
      errors.push('Enter your password');
    }
    this.setState({
      errors: errors,
      isError: errors.length > 0
    });
    return errors;
  };

  reset = () => {
    this.setState({ isLoading: true });
    console.log('Resetting: ');
  };

  render() {
    const {
      email,
      isLoginModalOpen,
      isLoginSuccess,
      password,
      successMessage
    } = this.props.auth;
    const { isLoading } = this.state;

    return (
      <Modal
        show={ isLoginModalOpen }
        onHide={ this.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>User login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-signin">
            <div className="text-center mb-4">
              <img src="https://via.placeholder.com/80" alt=""/>
            </div>
            <div className="form-label-group">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="email-addon">
                    <FontAwesomeIcon icon={ faEnvelope } size="1x"/>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-describedby="email-addon"
                  value={ email }
                  onChange={ this.updateUserEmail }
                  required
                  autoFocus
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="password-addon">
                    <FontAwesomeIcon icon={ faKey } size="1x"/>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="email-addon"
                  value={ password }
                  onChange={ this.updateUserPassword }
                  required
                />
              </InputGroup>
            </div>
          </form>
          { isLoginSuccess === true &&
          <Alert variant="success">{ successMessage }</Alert>
          }
          { this.state.isError === true &&
          <Alert variant="danger">
            { this.state.errors.map((value, index) => {
              return <p key={ index }>{ value }</p>
            }) }
          </Alert>
          }
          { this.state.isLoading === true &&
          <ProgressBar animated now={ 100 } variant="success"/>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={ this.reset }
            disabled={ isLoading }>
            <FontAwesomeIcon icon={ faRedoAlt }/> Reset password
          </Button>
          <Button
            variant="warning"
            onClick={ this.signUp }
            disabled={ isLoading }>
            <FontAwesomeIcon icon={ faUserPlus }/> Sign up
          </Button>
          <Button
            variant="success"
            className="login"
            onClick={ this.signIn }
            disabled={ isLoading }>
            <FontAwesomeIcon icon={ faSignInAlt }/> Sign in
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateAuthenticatedStatus: (status) => dispatch(updateAuthenticatedStatus(status)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginSuccess: (status) => dispatch(updateLoginSuccess(status)),
  updateLoginSuccessMessage: (message) => dispatch(updateLoginSuccessMessage(message)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);