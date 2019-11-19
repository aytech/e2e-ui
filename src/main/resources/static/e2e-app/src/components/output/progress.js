import React from 'react';

export const ProgressBar = (props) => {
  if (props.show === true) {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated full" role="progressbar"
             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"/>
      </div>
    )
  }
  return null;
};