import React from 'react';

const Alert = (props) => {
  let className = 'alert alert-dismissible hidden',
    header = null, body = null;
  const {
    error,
    messages,
    success
  } = props;

  if (error === true) {
    header = 'Error processing request';
    className = 'alert alert-dismissible alert-danger';
  }

  if (error === false && success === true) {
    header = 'Success!';
    body = 'Process has started, log output will print below';
    className = 'alert alert-dismissible alert-success';
  }

  if (messages.map !== undefined) {
    body = messages.map((line, index) => <li key={ index }>{ line }</li>);
  }

  return (
    <div className={ className }>
      <button type="button" className="close" data-dismiss="alert">&times;</button>
      <h4 className="alert-heading">{ header }</h4>
      { body }
    </div>
  );
};

export default Alert;