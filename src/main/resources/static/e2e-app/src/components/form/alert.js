import React from 'react';

const Alert = (props) => {
  let className = 'alert alert-dismissible hidden',
    header = null, body = null;
  const {
    status,
    messages
  } = props;

  switch (status) {
    case true:
      header = 'Success!';
      className = 'alert alert-dismissible alert-success';
      break;
    case false:
      header = 'Error!';
      className = 'alert alert-dismissible alert-danger';
      break;
    default:
      return null;
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