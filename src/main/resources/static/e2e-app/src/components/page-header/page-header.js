import React, { Component } from 'react';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "../login/login";
import { connect } from "react-redux";
import {
  updateAuthenticatedStatus,
  updateLoginModalStatus,
  updateLoginWarn,
  updateLoginWarnMessage
} from "../../actions/authActions";
import { Link } from "react-router-dom";
import {
  fetchSettings,
  updateSystemVariables,
  updateVariables
} from "../../actions/settingsActions";

class PageHeader extends Component {

  componentDidMount() {
    const {variables} = this.props.settings;
    if (variables.length === 0) {
      this.props.fetchSettings();
    }
  }

  openLoginModal = () => {
    this.props.updateLoginModalStatus(true)
  };

  render() {
    const {
      isAuthenticated
    } = this.props.auth;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/">IDM E2E runner</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarColor01"
                aria-controls="navbarColor01" aria-expanded="false"
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            { isAuthenticated === true &&
            <li className="nav-item active">
              <Link className="nav-link" to="/settings">
                Settings
              </Link>
            </li>
            }
          </ul>
          { isAuthenticated === false &&
          <button type="button" className="hidden" onClick={ this.openLoginModal }>
            <FontAwesomeIcon icon={ faSignInAlt } size="2x"/>
          </button>
          }
        </div>
        <Login/>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchSettings: () => dispatch(fetchSettings()),
  updateAuthenticatedStatus: (status) => dispatch(updateAuthenticatedStatus(status)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateLoginWarn: (status) => dispatch(updateLoginWarn(status)),
  updateLoginWarnMessage: (message) => dispatch(updateLoginWarnMessage(message)),
  updateSystemVariables: (variables) => dispatch(updateSystemVariables(variables)),
  updateVariables: (variables) => dispatch(updateVariables(variables))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)