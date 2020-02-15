import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  reset,
  signIn,
  updateAuthenticatedStatus,
  updateLoginError,
  updateLoginErrorMessage, updateLoginProgress,
  updateLoginSuccess,
  updateLoginSuccessMessage,
  updateLoginWarn,
  updateLoginWarnMessage,
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
import ValidationService from "../../services/ValidationService";

class Login extends Component {

  authService = new AuthenticationService();
  validationService = new ValidationService();

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.signIn();
    }
  };

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  onHide = () => {
    this.props.updateLoginModalStatus(false);
  };

  sendSignUpRequest = (email, password) => {
    this.authService
      .register(email, password)
      .then(response => {
        const { errors, status } = response;
        if (status === 200) {
          this.props.updateLoginError(false);
          this.props.updateLoginErrorMessage('');
          this.props.updateLoginSuccess(true);
          this.props.updateLoginSuccessMessage(
            'Success, please check email to activate the new profile'
          );
        } else {
          this.props.updateLoginError(true);
          this.props.updateLoginSuccess(false);
          this.props.updateLoginErrorMessage(errors[0]);
        }
      })
      .finally(() => {
        this.props.updateLoginProgress(false);
      });
  };

  signIn = () => {
    const { email, password } = this.props.auth;
    this.props.updateLoginSuccess(false);
    if (this.isFormValid()) {
      this.props.signIn(email, password);
    }
  };

  signUp = () => {
    const { email, password } = this.props.auth;
    if (this.isFormValid()) {
      this.props.updateLoginProgress(true);
      this.sendSignUpRequest(email, password);
    }
  };

  reset = () => {
    this.props.reset(this.props.auth.email);
  };

  isFormValid = () => {
    const { email, password } = this.props.auth;
    if (this.validationService.isValidEmail(email) === false) {
      this.props.updateLoginError(true);
      this.props.updateLoginErrorMessage('Please enter valid email address');
      this.props.updateLoginWarn(false);
      this.props.updateLoginWarnMessage('');
      return false;
    }
    if (password === undefined || password.trim() === '') {
      this.props.updateLoginError(true);
      this.props.updateLoginErrorMessage('Enter your password');
      this.props.updateLoginWarn(false);
      this.props.updateLoginWarnMessage('');
      return false;
    }
    this.props.updateLoginError(false);
    return true;
  };

  render() {
    const {
      email,
      isLoginError,
      isLoginInProgress,
      isLoginModalOpen,
      isLoginSuccess,
      isLoginWarn,
      loginErrorMessage,
      loginSuccessMessage,
      loginWarnMessage,
      password
    } = this.props.auth;

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
                  onKeyDown={ this.onKeyDown }
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
                  onKeyDown={ this.onKeyDown }
                  required
                />
              </InputGroup>
            </div>
          </form>
          { isLoginSuccess === true &&
          <Alert variant="success">{ loginSuccessMessage }</Alert>
          }
          { isLoginWarn === true &&
          <Alert variant="warning">{ loginWarnMessage }</Alert>
          }
          { isLoginError === true &&
          <Alert variant="danger">{ loginErrorMessage }</Alert>
          }
          { isLoginInProgress === true &&
          <ProgressBar animated now={ 100 } variant="success"/>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={ this.reset }
            disabled={ isLoginInProgress }>
            <FontAwesomeIcon icon={ faRedoAlt }/> Reset password
          </Button>
          <Button
            variant="warning"
            onClick={ this.signUp }
            disabled={ isLoginInProgress }>
            <FontAwesomeIcon icon={ faUserPlus }/> Sign up
          </Button>
          <Button
            variant="success"
            className="login"
            onClick={ this.signIn }
            disabled={ isLoginInProgress }>
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
  reset: (email) => dispatch(reset(email)),
  signIn: (email, password) => dispatch(signIn(email, password)),
  updateAuthenticatedStatus: (status) => dispatch(updateAuthenticatedStatus(status)),
  updateLoginError: (status) => dispatch(updateLoginError(status)),
  updateLoginErrorMessage: (message) => dispatch(updateLoginErrorMessage(message)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginProgress: (status) => dispatch(updateLoginProgress(status)),
  updateLoginSuccess: (status) => dispatch(updateLoginSuccess(status)),
  updateLoginSuccessMessage: (message) => dispatch(updateLoginSuccessMessage(message)),
  updateLoginWarn: (status) => dispatch(updateLoginWarn(status)),
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);