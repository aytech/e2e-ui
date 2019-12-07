import React, { Component } from 'react';
import { connect } from "react-redux";
import { updateExecutionTime } from "../../actions/outputActions";

class DateFormat extends Component {
  finished = 0;
  started = 0;
  millisInDay = 86400000;
  millisInHour = 3600000;
  millisInMinute = 60000;
  millisInSecond = 1000;
  hours = 0;
  minutes = 0;
  seconds = 0;

  tick = () => {
    this.unTick();
    this.tickInterval = setInterval(() => {
      this.setTime()
    }, 1000);
  };

  setTime = () => {
    const timeDiff = this.finished - this.started;
    this.hours = Math.floor((timeDiff % this.millisInDay) / this.millisInHour);
    this.minutes = Math.floor(((timeDiff % this.millisInDay) % this.millisInHour) / this.millisInMinute);
    this.seconds = Math.floor((((timeDiff % this.millisInDay) % this.millisInHour) % this.millisInMinute) / this.millisInSecond);
    this.updateTimeout = setTimeout(() => {
      this.props.updateExecutionTime(this.getTimeString());
      clearTimeout(this.updateTimeout);
    });
  };

  getTimeString = () => {
    let value = `${ this.seconds } seconds`;
    if (this.minutes > 0) {
      value = `${ this.minutes } minutes ${ value }`;
    }
    if (this.hours > 0) {
      value = `${ this.hours } hours ${ value }`;
    }
    return value;
  };

  unTick = () => {
    if (this.tickInterval !== undefined) {
      clearInterval(this.tickInterval);
    }
  };

  render() {
    const {
      finishedTimestamp,
      startedTimestamp,
      executionTime
    } = this.props.state;

    if (finishedTimestamp === 0 && startedTimestamp === 0) {
      return null
    }

    this.finished = finishedTimestamp === 0 ? new Date().getTime() : finishedTimestamp;
    this.started = startedTimestamp;

    if (this.started > 0) {
      this.tick();
    }
    if (finishedTimestamp > 0) {
      this.unTick();
      this.setTime();
    }

    return (
      <p>
        <span className="text-warning"> Execution time:</span>
        <span className="text-danger"> { executionTime }</span>
      </p>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateExecutionTime: (time) => dispatch(updateExecutionTime(time))
});

export default connect(mapStateToProps, mapDispatchToProps)(DateFormat);