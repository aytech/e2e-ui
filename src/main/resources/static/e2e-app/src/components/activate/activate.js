import React, { Component } from 'react';
import { Redirect, withRouter } from "react-router";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthenticationService from "../../services/AuthenticationService";
import './activate.css';

class Activate extends Component {

  authenticationService = new AuthenticationService();

  constructor(props) {
    super(props);
    this.state = {
      text: 'Activating account...',
      loading: true
    }
  }

  componentDidMount() {
    const { code } = this.props.match.params;
    this.authenticationService
      .activate(code)
      .then(response => {
        if (response.status === 404) {
          this.setState(() => ({
            text: <span>Cannot activate user, navigate to <a href="/">main page</a> to sign up.</span>,
            loading: false
          }));
        } else {
          this.setState(() => ({
            text: <Redirect to="/"/>,
            loading: false
          }));
        }
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row-fluid">
          { this.state.loading === true &&
          <div className="col-12 text-center">
            <div className="fa-3x align-self-center">
              <FontAwesomeIcon icon={ faCog } spin/>
            </div>
          </div>
          }
          <div className="col-12">
            { this.state.text }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Activate);