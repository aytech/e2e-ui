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
import { updateLoginModalStatus, updateLoginSuccess, updateLoginSuccessMessage } from "../../actions/authActions";
import PageHeader from "../page-header/page-header";

class PasswordReset extends Component {

  authenticationService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      isError: false,
      isLoading: false,
      password_1: '',
      password_2: ''
    }
  }

  onPasswordOneChange = (event) => {
    this.setState({
      password_1: event.target.value
    })
  };

  onPasswordTwoChange = (event) => {
    this.setState({
      password_2: event.target.value
    })
  };

  isValidForm = () => {
    const { password_1, password_2 } = this.state;
    const passwordOneValid = !this.isValueEmpty(password_1);
    const passwordTwoValid = !this.isValueEmpty(password_2);
    const passwordsMatch = this.valuesMatch(password_1, password_2);
    if (!passwordOneValid || !passwordTwoValid || !passwordsMatch) {
      this.setState({
        errorMessage: 'Enter new password twice',
        isError: true,
      });
      return false;
    }
    return true;
  };

  isValueEmpty = (value) => {
    return value === undefined || value.trim() === '';
  };

  valuesMatch = (first, second) => {
    return first === second;
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
    const { password_1 } = this.state;
    this.authenticationService
      .resetPassword(password_1, code)
      .then(response => {
        const { status } = response;
        if (status === 404) {
          this.setState({
            isError: true,
            errorMessage: 'User not found'
          })
        }
        if (status === 200) {
          this.props.updateLoginModalStatus(true);
          this.props.updateLoginSuccess(true);
          this.props.updateLoginSuccessMessage('Password was reset, login with the new password');
          this.props.history.push('/');
        }
      })
      .finally(() => {
        this.setState({
          isLoading: false
        })
      });
  };

  render() {
    const { password_1, password_2 } = this.state;
    const match = this.valuesMatch(password_1, password_2);
    let firstClass = '';
    let secondClass = '';
    if (!this.isValueEmpty(password_2)) {
      firstClass = match ? 'is-valid' : 'is-invalid';
    }
    if (!this.isValueEmpty(password_1)) {
      secondClass = match ? 'is-valid' : 'is-invalid';
    }
    return (
      <React.Fragment>
        <PageHeader/>
        <Container fluid={ true }>
          <Row>
            <Col>
              <Form className="reset-form">
                <div className="text-center mb-4">
                  <img src="https://via.placeholder.com/80" alt=""/>
                </div>
                <div className="mb-4">
                  <h5>Enter your new password</h5>
                </div>
                <Form.Group className="has-success has-danger">
                  <Form.Control
                    type="password"
                    value={ this.state.password_1 }
                    placeholder="New password"
                    className={ firstClass }
                    onChange={ this.onPasswordOneChange }/>
                  <div className="invalid-feedback">Passwords must match</div>
                </Form.Group>
                <Form.Group className="has-danger has-success">
                  <Form.Control
                    type="password"
                    value={ this.state.password_2 }
                    placeholder="Repeat password"
                    className={ secondClass }
                    onChange={ this.onPasswordTwoChange }/>
                  <div className="invalid-feedback">Passwords must match</div>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginSuccess: (status) => dispatch(updateLoginSuccess(status)),
  updateLoginSuccessMessage: (message) => dispatch(updateLoginSuccessMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);