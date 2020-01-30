import React, { Component } from 'react';
import { Redirect } from "react-router";
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
          this.props.updateLoginModalStatus(true);
          this.props.updateLoginSuccess(true);
          this.props.updateLoginSuccessMessage('You profile was activated, please login');
          this.props.updateUserEmail(email);
          this.setState(() => ({
            loading: false,
            text: <Redirect to="/"/>
          }));
        }
      });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="col-12 text-center">
            <div className="fa-10x align-self-center">
              { this.state.loading === true &&
              <FontAwesomeIcon icon={ faCog } spin className="text-info"/>
              }
              { this.state.error === true &&
              <FontAwesomeIcon icon={ faBan } className="text-danger"/>
              }
            </div>
          </div>
          <div className="col-12 display-4">
            { this.state.text }
          </div>
        </div>
      </div>
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
