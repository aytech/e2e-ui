import React, { Component } from 'react';
import { connect } from "react-redux";

class ListSystemVariables extends Component {
  render() {
    const {
      systemVariables
    } = this.props.settings;

    return (
      <div className="system-vars list-group">
        { systemVariables.map((variable, index) => (
          <span className="list-group-item list-group-item-action active" key={ index }>
                { variable.key } : { variable.value }
              </span>
        )) }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ListSystemVariables);