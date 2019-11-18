import React, { Component } from 'react';
import PageHeader from "../page-header/page-header";
import Button from "../button/button";
import StandardOutput from "./standard-output";
import DockerService from "../../services/DockerService";
import './app.css';
import Form from "../form/form";

export default class App extends Component {

  dockerService = new DockerService();

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

  componentDidMount() {
    this.getE2EBuildStatus();
  }

  componentWillUnmount() {

  }

  getE2EBuildStatus = () => {
    this.setState({ loadingStatus: true });
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
        this.setState({
          output: job.messages === null ? [] : job.messages,
          loadingStatus: false,
          serverErrorState: false,
          buildInProgress: job.running,
          statusTitle: job.running ? this.getRunningBuildOutputTitle() : this.getNoBuildOutputTitle()
        });
      })
      .catch(() => {
        this.setState({
          loadingStatus: false,
          serverErrorState: true,
          statusTitle: this.getNetworkErrorTitle()
        });
        if (this.timerID === undefined) {
          this.timerID = setInterval(this.getE2EBuildStatus, 2000);
        }
      });
  };

  updateRunRequest = (event) => {
    if (event.target.name in this.runRequestData) {
      this.runRequestData[event.target.name] = event.target.value
    }
    this.setState({ runRequestData: this.runRequestData });
  };

  render() {
    return (
      <React.Fragment>
        <PageHeader/>
        <div className="container">
          <div className="jumbotron">
            <h1 className="display-3">Run</h1>
            <p className="lead">
              Rebuild E2E image or run test suite using controls below.
            </p>
            <hr className="my-4"/>
            <Form/>
            <hr className="my-4"/>
            <Button
              text={ "Get build status" }
              styleType="primary"
              type="button"
              disabled={ this.state.buildInProgress || this.state.serverErrorState }
              loading={ this.state.loadingStatus }
              onClick={ this.getE2EBuildStatus }/>
          </div>
          <div className="jumbotron">
            <h1 className="display-3">Output:</h1>
            { this.state.statusTitle }
            { this.state.buildInProgress === true &&
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated full" role="progressbar"
                   aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"/>
            </div>
            }
            <div className="output">
              {
                this.state.output.map(
                  (line, index) => <StandardOutput key={ index } text={ line }/>
                )
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}