import React, { Component } from 'react';
import { connect } from "react-redux";
import { updateAuthenticatedStatus, updateUserEmail, updateUserPassword } from "../../actions/authActions";
import Modal from "react-bootstrap/Modal";
import { updateLoginModalStatus } from "../../actions/authActions";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import AuthenticationService from "../../services/AuthenticationService";

class Login extends Component {

  authService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isError: false,
      isSuccess: false,
      successMessage: '',
      unauthorized: false
    };
  }

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
    this.authService
      .login(email, password)
      .then(response => {
        console.log('Authentication: ', response);
        if (response.status === 200) {
          this.props.updateAuthenticatedStatus(true);
          this.props.updateLoginModalStatus(false);
        }
        if (response.status === 401) {
          this.setState({
            unauthorized: true
          });
        }
      });
  };

  signUp = () => {
    const { email, password } = this.props.auth;
    this.authService
      .register(email, password)
      .then(data => {
        console.log('Data: ', data);
        this.setState({
          isError: data.status !== 200,
          errors: data.errors
        });
        setTimeout(() => {
          console.log('State: ', this.state)
        }, 50);
      });
  };

  reset = () => {
    console.log('Resetting: ');
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
          { this.state.unauthorized === true &&
          <Alert variant="warning">
            Invalid credentials
          </Alert>
          }
          { this.state.isSuccess === true &&
          <Alert variant="success">
            { this.state.successMessage }
          </Alert>
          }
          { this.state.isError === true &&
          <Alert variant="danger">
            { this.state.errors.map((value, index) => {
              return <p key={ index }>{ value }</p>
            }) }
          </Alert>
          }
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
  updateAuthenticatedStatus: (status) => dispatch(updateAuthenticatedStatus(status)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);