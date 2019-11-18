import React, { Component } from 'react';
import { connect } from "react-redux";
import StandardOutput from "../app/standard-output";
import Title from "./title";

class Output extends Component {

  render() {
    const {
      buildInProgress,
      output
    } = this.props.outputState;

    return (
      <div className="jumbotron">
        <h1 className="display-3">Output:</h1>
        <Title/>
        { buildInProgress === true &&
        <div className="progress">
          <div className="progress-bar progress-bar-striped progress-bar-animated full" role="progressbar"
               aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"/>
        </div>
        }
        <div className="output">
          {
            output.map(
              (line, index) => <StandardOutput key={ index } text={ line }/>
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);