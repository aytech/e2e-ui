import React, { Component } from 'react';
import {
  faSignInAlt,
  faUserCog
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "../login/login";
import { connect } from "react-redux";
import { updateLoginModalStatus } from "../../actions/authActions";
import Settings from "../settings/settings";
import { updateSettingsModalStatus } from "../../actions/stateActions";

class PageHeader extends Component {

  openModal = () => {
    this.props.updateLoginModalStatus(true)
  };

  openSettings = () => {
    this.props.updateSettingsModalStatus(true)
  };

  render() {
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
              <a className="nav-link" href="/">Home <span
                className="sr-only">(current)</span></a>
            </li>
          </ul>
          <button type="button" className="hidden" onClick={ this.openModal }>
            <FontAwesomeIcon icon={ faSignInAlt } size="2x"/>
          </button>
          <button type="button" className="hidden" onClick={ this.openSettings }>
            <FontAwesomeIcon icon={ faUserCog } size="2x"/>
          </button>
        </div>
        <Login/>
        <Settings/>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateLoginModalStatus: (status) => dispatch(updateLoginModalStatus(status)),
  updateSettingsModalStatus: (status) => dispatch(updateSettingsModalStatus(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)