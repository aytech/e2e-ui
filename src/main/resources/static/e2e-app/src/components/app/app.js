import React, { Component } from 'react';
import PageHeader from "../page-header/page-header";
import './app.css';
import Form from "../form/form";
import Output from "../output/output";

export default class App extends Component {

  getNoBuildOutputTitle = () => {
    return (
      <p className="text-warning">
        No builds are currently running. Previous output:
      </p>
    )
  };

  getRunningBuildOutputTitle = () => {
    return (
      <p className="text-danger">
        Build running, please wait. Process output will print below.
      </p>
    )
  };

  getNetworkErrorTitle = () => {
    return (
      <p className="text-danger">
        Internal server error, cannot handle requests.
      </p>
    )
  };

  runRequestData = {
    user: '',
    password: ''
  };

  state = {
    serverErrorState: false,
    loadingBuild: false,
    loadingStatus: false,
    buildInProgress: false,
    statusTitle: this.getNoBuildOutputTitle(),
    output: [],
    formError: false,
    formErrorMessages: [],
    runRequestData: this.runRequestData,
    successfulRun: false
  };

  render() {
    return (
      <React.Fragment>
        <PageHeader/>
        <div className="container">
          <Form/>
          <Output/>
        </div>
      </React.Fragment>
    );
  }
}