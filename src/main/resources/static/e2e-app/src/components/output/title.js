import React from 'react';

export const Title = (props) => {
  let className = 'text-warning';
  let text = 'No builds are currently running. Previous output:';
  const {
    debug,
    error,
    serverErrorState,
    buildInProgress
  } = props;

  if (serverErrorState === true) {
    className = 'text-danger';
    text = 'Internal server error, cannot handle requests.';
  }

  if (buildInProgress === true) {
    className = 'text-danger';
    text = 'Build running, please wait. Current view: ';
    if (debug === true) {
      text += 'DEBUG';
    } else if (error === true) {
      text += 'ERROR'
    } else {
      text += 'NORMAL'
    }
  }

  return (
    <p className={ className }>{ text }</p>
  )
};