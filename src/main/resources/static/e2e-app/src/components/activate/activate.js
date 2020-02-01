import React, { Component } from 'react';
import { faBan, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthenticationService from "../../services/AuthenticationService";
import './activate.css';
import {
  updateLoginModalStatus,
  updateLoginSuccess,
  updateLoginSuccessMessage,
  updateUserEmail
} from "../../actions/authActions";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PageHeader from "../page-header/page-header";

class Activate extends Component {

  authenticationService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      text: 'Activating account...'
    }
  }

  componentDidMount() {
    const { code } = this.props.match.params;
    this.authenticationService
      .activate(code)
      .then(response => {
        const { email, status } = response;
        if (status === 404) {
          this.setState(() => ({
            error: true,
            loading: false,
            text:
              <span>
                Cannot activate user, navigate to <a href="/">main page</a> to sign up.
              </span>
          }));
        } else {
          this.setState(() => ({
            loading: false,
            text: ''
          }));
          this.props.updateLoginModalStatus(true);
          this.props.updateLoginSuccess(true);
          this.props.updateLoginSuccessMessage('You profile was activated, please login');
          this.props.updateUserEmail(email);
          this.props.history.push('/');
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <PageHeader/>
        <Container fluid={ true }>
          <Row className="activate-row">
            <Col>
              <div className="fa-10x text-center">
                { this.state.loading === true &&
                <FontAwesomeIcon icon={ faCog } spin className="text-info"/>
                }
                { this.state.error === true &&
                <FontAwesomeIcon icon={ faBan } className="text-danger"/>
                }
              </div>
              <div className="display-4">
                { this.state.text }
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginSuccess: (status) => dispatch(updateLoginSuccess(status)),
  updateLoginSuccessMessage: (message) => dispatch(updateLoginSuccessMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Activate);
