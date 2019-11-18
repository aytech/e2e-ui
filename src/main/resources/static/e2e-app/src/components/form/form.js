import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  updateFormErrorBoolean,
  updateFormErrors,
  updateLoadingStatus,
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
      } = this.props.formState;
      if (formError !== true) {
        this.props.updateLoadingStatus(true);
        this.dockerService
          .runE2ESuite({ email: email, password: password })
          .then(response => {
            if (response.status === 200) {
              // this.setState({
              //         loadingBuild: false,
              //         loadingStatus: true,
              //         runRequestData: { user: '', password: '' },
              //         successfulRun: true
              //       });
              //       this.timeoutID = setTimeout(() => {
              //         this.getE2EBuildStatus();
              //         clearTimeout(this.timeoutID);
              //       });
            } else {
              //       this.setState({
              //         formError: true,
              //         formErrorMessages: response.errors,
              //         loadingBuild: false
              //       })
            }
          })
          .catch(() => {
            this.props.updateServerErrorState(true);
          })
          .finally(() => {
            this.props.updateLoadingStatus(false);
          })
      }
    });
  };

  validateForm = async () => {
    let messages = [], error = false;
    const { email, password } = this.props.formState;

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
      buildInProgress,
      serverErrorState
    } = this.props.formState;

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
          disabled={ buildInProgress }/>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  updateUserEmail: (email) => dispatch(updateUserEmail(email)),
  updateUserPassword: (password) => dispatch(updateUserPassword(password)),
  updateFormErrorBoolean: (isError) => dispatch(updateFormErrorBoolean(isError)),
  updateFormErrors: (errors) => dispatch(updateFormErrors(errors)),
  updateLoadingStatus: (isLoading) => dispatch(updateLoadingStatus(isLoading)),
  updateServerErrorState: (isError) => dispatch(updateServerErrorState(isError))
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);