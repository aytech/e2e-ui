import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  updateBuildStatus,
  updateFormMessages,
  updateFormStatus,
  updateLoading,
  updateLoadingStatus,
  updateStdInput,
  updateRunStatus,
  updateServerErrorState,
  updateUserEmail,
  updateUserPassword,
  updateStdErr, updateMessages
} from "../../actions/formActions";
import Button from "../button/button";
import DockerService from "../../services/DockerService";
import Alert from "./alert";

class Form extends Component {

  dockerService = new DockerService();

  componentDidMount() {
    this.getE2EBuildStatus();
  }

  updateUserEmail = (event) => {
    this.props.updateUserEmail(event.target.value);
  };

  updateUserPassword = (event) => {
    this.props.updateUserPassword(event.target.value);
  };

  runE2E = async (event) => {
    event.preventDefault();
    this.validateForm()
      .then(() => {
        const {
          email,
          formStatus,
          password
        } = this.props.state;

        if (formStatus === true) {
          this.props.updateLoading(true);
          this.dockerService
            .runE2ESuite({ email: email, password: password })
            .then(response => {
              if (response.status === 200) {
                this.props.updateFormMessages(['Process has started, log output will print below']);
                this.props.updateRunStatus(true);
                this.timeoutID = setTimeout(() => {
                  this.getE2EBuildStatus();
                  clearTimeout(this.timeoutID);
                }, 2000);
              } else {
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

  getE2EBuildStatus = (event) => {
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
          this.props.updateStdInput([]);
        } else {
          this.props.updateStdInput(job.messages);
        }
        this.props.updateMessages(job.messages);
        this.props.updateStdErr(job.stdErr);
        this.props.updateStdInput(job.stdInput);
        this.props.updateBuildStatus(job.running);
        this.props.updateServerErrorState(false);
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

    await this.props.updateFormStatus(status);
    await this.props.updateFormMessages(messages);
  };

  render() {
    const {
      email,
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
          <Alert
            status={ formStatus }
            messages={ formMessages }/>
          <Button
            text={ "Run E2E build" }
            type="submit"
            styleType="primary"
            error={ formStatus === false || serverErrorState }
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
  updateFormStatus: (status) => dispatch(updateFormStatus(status)),
  updateFormMessages: (messages) => dispatch(updateFormMessages(messages)),
  updateLoading: (isLoading) => dispatch(updateLoading(isLoading)),
  updateLoadingStatus: (isStatusLoading) => dispatch(updateLoadingStatus(isStatusLoading)),
  updateMessages: (messages) => dispatch(updateMessages(messages)),
  updateStdErr: (error) => dispatch(updateStdErr(error)),
  updateStdInput: (input) => dispatch(updateStdInput(input)),
  updateRunStatus: (isSuccessful) => dispatch(updateRunStatus(isSuccessful)),
  updateServerErrorState: (isError) => dispatch(updateServerErrorState(isError)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);