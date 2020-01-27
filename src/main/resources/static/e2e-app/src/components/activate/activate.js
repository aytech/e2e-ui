import React, { Component } from 'react';
import { withRouter } from "react-router";
import AuthenticationService from "../../services/AuthenticationService";

class Activate extends Component {

  authenticationService = new AuthenticationService();

  render() {
    let { code } = this.props.match.params;
    this.authenticationService
      .activate(code)
      .then(response => {
        console.log('Response: ', response);
      });
    return null
  }
}

export default withRouter(Activate);