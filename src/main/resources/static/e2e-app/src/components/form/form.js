import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  fetchRunRequest,
  fetchStatus,
  updateFormMessages,
  updateFormStatus,
  updateUserEmail,
  updateUserPassword,
  updateBranch,
  updateDocumentType,
  updateCanBeStopped
} from "../../actions/formActions";
import Button from "../button/button";
import Alert from "./alert";

class Form extends Component {

  componentDidMount() {
    const { fetchStatus } = this.props;
    fetchStatus();
    this.timerID = setInterval(fetchStatus, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  updateBranch = (event) => {
    this.props.updateBranch(event.target.value);
  };

  updateDocumentType = (event) => {
    this.props.updateDocumentType(event.target.value);
  };

  runE2E = (event) => {
    event.preventDefault();
    const validationStatus = this.validateForm();
    if (validationStatus.status === true) {
      const request = {
        branch: this.props.state.branch,
        documentType: this.props.state.documentType,
        email: this.props.state.email,
        password: this.props.state.password
      };
      this.props.fetchRunRequest(request)
    } else {
      this.props.updateFormStatus(false);
      this.props.updateFormMessages(validationStatus.messages);
    }
  };

  fetchStatus = (event) => {
    event.preventDefault();
    this.props.fetchStatus();
  };

  validateForm = () => {
    let messages = [], status = true;
    const { email, password } = this.props.state;
    if (email === undefined || email === '') {
      status = false;
      messages.push('Provide user email address');
    }
    if (password === undefined || password === '') {
      status = false;
      messages.push('Provide user password');
    }
    return {
      messages: messages,
      status: status
    }
  };

  render() {
    const {
      branch,
      email,
      documentType,
      password,
      formStatus,
      formMessages,
      isLoading,
      isStatusLoading,
      buildInProgress,
      serverErrorState
    } = this.props.state;

    return (
      <div className="jumbotron">
        <h1 className="display-3">
          Selenium Runner
        </h1>
        <p className="lead">
          Rebuild E2E image or run test suite using controls below.
        </p>
        <hr className="my-4"/>
        <form onSubmit={ this.runE2E }>
          <fieldset>
            <legend>Credentials</legend>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp"
                     placeholder="Enter email" autoComplete="username" value={ email }
                     onChange={ this.updateUserEmail }/>
              <small id="emailHelp" className="form-text text-muted">
                Email address that has valid Infor OS access.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password"
                     placeholder="Password" autoComplete="current-password" value={ password }
                     onChange={ this.updateUserPassword }/>
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch name</label>
              <input type="text" className="form-control" id="branch" name="branch"
                     placeholder="Branch name" value={ branch }
                     onChange={ this.updateBranch }/>
            </div>
            <div className="form-group">
              <label htmlFor="branch">Document type</label>
              <input type="text" className="form-control" id="docType" name="docType"
                     placeholder="Document type name" value={ documentType }
                     onChange={ this.updateDocumentType }/>
            </div>
          </fieldset>
          <Alert
            status={ formStatus }
            messages={ formMessages }/>
          <Button
            text={ "Run E2E build" }
            type="submit"
            className="btn btn-block btn-primary"
            error={ formStatus === false || serverErrorState }
            loading={ isLoading || buildInProgress }
            disabled={ buildInProgress || isLoading }/>
          <Button
            text={ "Get build status" }
            type="button"
            className="btn btn-block btn-primary"
            error={ serverErrorState }
            disabled={ buildInProgress || isStatusLoading }
            loading={ isStatusLoading }
            onClick={ this.fetchStatus }/>
        </form>
        <hr className="my-4"/>
      </div>
    )
  }
}

const
  mapStateToProps = state => ({
    ...state
  });
const
  mapDispatchToProps = dispatch => ({
    fetchRunRequest: (request) => dispatch(fetchRunRequest(request)),
    fetchStatus: () => dispatch(fetchStatus()),
    updateBranch: (branch) => dispatch(updateBranch(branch)),
    updateCanBeStopped: (status) => dispatch(updateCanBeStopped(status)),
    updateDocumentType: (documentType) => dispatch(updateDocumentType(documentType)),
    updateFormStatus: (status) => dispatch(updateFormStatus(status)),
    updateFormMessages: (messages) => dispatch(updateFormMessages(messages)),
    updateUserEmail: (email) => dispatch(updateUserEmail(email)),
    updateUserPassword: (password) => dispatch(updateUserPassword(password)),
  });

export default connect(mapStateToProps, mapDispatchToProps)(Form);