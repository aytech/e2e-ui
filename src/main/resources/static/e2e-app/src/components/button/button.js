import React from 'react';
import './button.css';

const Button = (props) => {
  const { loading, disabled, type, text, styleType, error, onClick } = props;
  let style = 'btn btn-block';
  let spinnerClassName;
  let errorClassName;

  if (styleType === 'primary') {
    style += ' btn-primary';
  } else {
    style += ' btn-default';
  }

  if (loading === true) {
    spinnerClassName = 'fas fa-sync fa-spin loading'
  } else {
    spinnerClassName = 'fas fa-sync fa-spin'
  }

  if (error === true) {
    errorClassName = 'fas fa-exclamation-circle visible';
  } else {
    errorClassName = 'fas fa-exclamation-circle';
  }

  return (
    <button
      type={ type }
      className={ style }
      onClick={ onClick }
      disabled={ disabled === true }>
      <div className="fa-sm">
        <i className={ errorClassName }/>
        <i className={ spinnerClassName }/>
        <span className="button-text">
            { text }
          </span>
      </div>
    </button>
  )
};

export default Button;