import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";

class Output extends Component {

  render() {

    const {
      buildInProgress,
      output,
      serverErrorState
    } = this.props.state;

    return (
      <div className="jumbotron">
        <h1 className="display-3">Output:</h1>
        <Title serverErrorState={ serverErrorState }/>
        <ProgressBar show={ buildInProgress }/>
        <StandardOutput output={ output }/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Output);