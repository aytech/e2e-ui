import React, { Component } from 'react';
import { connect } from "react-redux";
import { updateUserEmail, updateUserPassword } from "../../actions/authActions";
import Modal from "react-bootstrap/Modal";
import { updateLoginModalStatus } from "../../actions/authActions";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

class Login extends Component {

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  closeModal = () => {
    this.props.updateLoginModalStatus(false)
  };

  signIn = () => {
    const { email, password } = this.props.auth;
    console.log(`Sign in ${ email } with ${ password }`)
  };

  signUp = () => {
    const { email, password } = this.props.auth;
    console.log(`Sign up ${ email } with ${ password }`)
  };

  render() {
    const {
      email,
      isLoginModalOpen,
      password
    } = this.props.auth;

    return (
      <Modal show={ isLoginModalOpen }>
        <Modal.Header>
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
          <Alert variant="danger">
            Error
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ this.signIn }>Sign in</Button>
          <Button variant="primary" onClick={ this.signUp }>Sign up</Button>
          <Button variant="secondary" onClick={ this.closeModal }>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);