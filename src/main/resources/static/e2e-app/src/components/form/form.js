import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  updateBuildStatus,
  updateFormErrorBoolean,
  updateFormErrors,
  updateLoading,
  updateLoadingStatus,
  updateOutput,
  updateRunStatus,
  updateServerErrorState,
  updateUserEmail,
  updateUserPassword
} from "../../actions/formActions";
import Button from "../button/button";
import DockerService from "../../services/DockerService";

class Form extends Component {

  dockerService = new DockerService();

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  runE2E = async (event) => {
    event.preventDefault();
    this.validateForm().then(() => {
      const {
        email,
        formError,
        password
      } = this.props.state;

      if (formError !== true) {
        this.props.updateLoading(true);
        this.dockerService
          .runE2ESuite({ email: email, password: password })
          .then(response => {
            if (response.status === 200) {
              this.props.updateRunStatus(true);
              this.props.updateUserEmail(null);
              this.props.updateUserPassword(null);
              this.timeoutID = setTimeout(() => {
                this.getE2EBuildStatus();
                clearTimeout(this.timeoutID);
              }, 2000);
            } else {
              this.props.updateFormErrorBoolean(true);
              this.props.updateFormErrors(response.errors);
            }
          })
          .catch(() => {
            this.props.updateServerErrorState(true);
          })
          .finally(() => {
            this.props.updateLoading(false);
          })
      }
    });
  };

  getE2EBuildStatus = async (event) => {
    if (event !== undefined) {
      event.preventDefault();
    }
    this.props.updateLoadingStatus(true);
    this.dockerService
      .getDockerBuildStatus()
      .then(job => {
        if (job.running === true) {
          if (this.timerID === undefined) {
            this.timerID = setInterval(this.getE2EBuildStatus, 2000);
          }
        } else {
          if (this.timerID !== undefined) {
            clearInterval(this.timerID);
          }
        }
        if (job.messages === null) {
          this.props.updateOutput([]);
        } else {
          this.props.updateOutput(job.messages);
        }
        this.props.updateServerErrorState(false);
        this.props.updateBuildStatus(job.running);
      })
      .catch(() => {
        this.props.updateServerErrorState(true);
        if (this.timerID === undefined) {
          this.timerID = setInterval(this.getE2EBuildStatus, 2000);
        }
      })
      .finally(() => {
        this.props.updateLoadingStatus(false);
      });
  };

  validateForm = async () => {
    let messages = [], error = false;
    const { email, password } = this.props.state;

    if (email === undefined || email === '') {
      error = true;
      messages.push('Provide user email address');
    }
    if (password === undefined || password === '') {
      error = true;
      messages.push('Provide user password');
    }

    await this.props.updateFormErrorBoolean(error);
    await this.props.updateFormErrors(messages);
  };

  render() {
    let errorMessageClass, successMessageClass;
    const {
      email,
      password,
      formError,
      successfulRun,
      formErrorMessages,
      isLoading,
      isStatusLoading,
      buildInProgress,
      serverErrorState
    } = this.props.state;

    if (formError === true) {
      errorMessageClass = 'alert alert-dismissible alert-danger';
    } else {
      errorMessageClass = 'alert alert-dismissible alert-danger hidden';
    }

    if (successfulRun === true) {
      successMessageClass = 'alert alert-dismissible alert-success';
    } else {
      successMessageClass = 'alert alert-dismissible alert-success hidden';
    }

    return (
      <div className="jumbotron">
        <h1 className="display-3">Run</h1>
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
                     placeholder="Enter email" value={ email } onChange={ this.updateUserEmail }/>
              <small id="emailHelp" className="form-text text-muted">
                Email address that has valid Infor OS access.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password"
                     placeholder="Password" value={ password } onChange={ this.updateUserPassword }/>
            </div>
          </fieldset>
          <div className={ errorMessageClass }>
            <button type="button" className="close" data-dismiss="alert">&times;</button>
            <h4 className="alert-heading">Error processing request</h4>
            <p className="mb-0">
              Please correct errors:
              {
                formErrorMessages.map(
                  (line, index) => <li key={ index }>{ line }</li>
                )
              }
            </p>
          </div>
          <div className={ successMessageClass }>
            <button type="button" className="close" data-dismiss="alert">&times;</button>
            <h4 className="alert-heading">Success!</h4>
            Process has started, log output will print below
          </div>
          <Button
            text={ "Run E2E build" }
            type="submit"
            styleType="primary"
            error={ formError || serverErrorState }
            loading={ isLoading }
            disabled={ buildInProgress || isLoading }/>
          <Button
            text={ "Get build status" }
            styleType="primary"
            type="button"
            error={ serverErrorState }
            disabled={ buildInProgress || isStatusLoading }
            loading={ isStatusLoading }
            onClick={ this.getE2EBuildStatus }/>
        </form>
        <hr className="my-4"/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  updateBuildStatus: (isRunning) => dispatch(updateBuildStatus(isRunning)),
  updateFormErrorBoolean: (isError) => dispatch(updateFormErrorBoolean(isError)),
  updateFormErrors: (errors) => dispatch(updateFormErrors(errors)),
  updateLoading: (isLoading) => dispatch(updateLoading(isLoading)),
  updateLoadingStatus: (isStatusLoading) => dispatch(updateLoadingStatus(isStatusLoading)),
  updateOutput: (output) => dispatch(updateOutput(output)),
  updateRunStatus: (isSuccessful) => dispatch(updateRunStatus(isSuccessful)),
  updateServerErrorState: (isError) => dispatch(updateServerErrorState(isError)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);