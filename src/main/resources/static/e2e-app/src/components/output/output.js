import React, { Component } from 'react';
import { connect } from "react-redux";
import { ProgressBar } from "./progress";
import { Title } from "./title";
import StandardOutput from "./standard-output";
import { toggleDebugEnabled } from "../../actions/outputActions";

class Output extends Component {

  render() {

    const {
      buildInProgress,
      debugOutputEnabled,
      messages,
      stdErr,
      stdInput,
      serverErrorState
    } = this.props.state;

    return (
      <div className="jumbotron">
        <h1 className="display-3">Output:</h1>
        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="customCheck1" checked={ debugOutputEnabled }
                   onChange={ () => {
                     this.props.toggleDebugEnabled(debugOutputEnabled)
                   } }/>
            <label className="custom-control-label" htmlFor="customCheck1">Check this custom checkbox</label>
          </div>
        </div>
        <Title
          buildInProgress={ buildInProgress }
          serverErrorState={ serverErrorState }/>
        <ProgressBar show={ buildInProgress }/>
        <StandardOutput
          messages={ messages }
          stdInput={ stdInput }
          stdErr={ stdErr }/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  toggleDebugEnabled: (isEnabled) => dispatch(toggleDebugEnabled(isEnabled)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Output);