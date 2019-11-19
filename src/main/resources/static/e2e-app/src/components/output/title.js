import React from 'react';

export const Title = (props) => {
  let className = 'text-warning';
  let text = 'No builds are currently running. Previous output:';

  if (props.serverErrorState === true) {
    className = 'text-danger';
    text = 'Internal server error, cannot handle requests.';
  }

  if (props.buildInProgress === true) {
    className = 'text-danger';
    text = 'Build running, please wait. Process output will print below.';
  }

  return (
    <p className={ className }>{ text }</p>
  )
};