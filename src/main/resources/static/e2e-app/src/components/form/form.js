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
  updateStdErr,
  updateMessages,
  updateReportStatus,
  updateBranch
} from "../../actions/formActions";
import Button from "../button/button";
import DockerService from "../../services/DockerService";
import Alert from "./alert";
import Cookies from "universal-cookie/lib";
import { E2E_NODE } from "../../constants/application";

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

  updateBranch = (event) => {
    this.props.updateBranch(event.target.value);
  };

  runE2E = async (event) => {
    event.preventDefault();
    this.validateForm()
      .then(() => {
        const {
          branch,
          email,
          formStatus,
          password
        } = this.props.state;

        if (formStatus === true) {
          this.props.updateLoading(true);
          this.dockerService
            .runE2ESuite({
              branch: branch,
              email: email,
              password: password
            })
            .then(response => {
              if (response.status === 200) {
                const cookies = new Cookies();
                cookies.set(E2E_NODE, response.nodeID, { path: '/' });
                this.props.updateFormMessages([ 'Process has started, log output will print below' ]);
                this.props.updateRunStatus(true);
                this.timeoutID = setTimeout(() => {
                  this.getE2EBuildStatus();
                  clearTimeout(this.timeoutID);
                }, 2000);
              } else {
                console.log("error response: ", response);
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
        this.props.updateReportStatus(job.reportAvailable);
      })
      .catch(() => {
        this.props.updateBuildStatus(false);
        this.props.updateServerErrorState(true);
        this.props.updateReportStatus(false);
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
      branch,
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
          </fieldset>
          <Alert
            status={ formStatus }
            messages={ formMessages }/>
          <Button
            text={ "Run E2E build" }
            type="submit"
            className="btn btn-block btn-primary"
            error={ formStatus === false || serverErrorState }
            loading={ isLoading }
            disabled={ buildInProgress || isLoading }/>
          <Button
            text={ "Get build status" }
            type="button"
            className="btn btn-block btn-primary"
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
  updateBranch: (branch) => dispatch(updateBranch(branch)),
  updateBuildStatus: (isRunning) => dispatch(updateBuildStatus(isRunning)),
  updateFormStatus: (status) => dispatch(updateFormStatus(status)),
  updateFormMessages: (messages) => dispatch(updateFormMessages(messages)),
  updateLoading: (isLoading) => dispatch(updateLoading(isLoading)),
  updateLoadingStatus: (isStatusLoading) => dispatch(updateLoadingStatus(isStatusLoading)),
  updateMessages: (messages) => dispatch(updateMessages(messages)),
  updateReportStatus: (status) => dispatch(updateReportStatus(status)),
  updateStdErr: (error) => dispatch(updateStdErr(error)),
  updateStdInput: (input) => dispatch(updateStdInput(input)),
  updateRunStatus: (isSuccessful) => dispatch(updateRunStatus(isSuccessful)),
  updateServerErrorState: (isError) => dispatch(updateServerErrorState(isError)),
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);