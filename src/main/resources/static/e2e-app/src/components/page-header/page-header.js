import React, { Component } from 'react';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "../login/login";
import { connect } from "react-redux";
import { updateAuthenticatedStatus, updateLoginModalStatus } from "../../actions/authActions";
import SettingsService from "../../services/SettingsService";
import { Link } from "react-router-dom";

class PageHeader extends Component {

  settingsService = new SettingsService();

  componentDidMount() {
    this.settingsService
      .getSettings()
      .then(response => {
        const { status } = response;
        if (status === 200) {
          this.props.updateAuthenticatedStatus(true);
        } else {
          this.props.updateAuthenticatedStatus(false);
        }
      })
      .catch(error => {
        console.log('Error: ', error)
      })
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
  updateAuthenticatedStatus: (status) => dispatch(updateAuthenticatedStatus(status)),
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)