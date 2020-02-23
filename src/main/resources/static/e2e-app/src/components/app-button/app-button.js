import React from 'react';
import './app-button.css';

const AppButton = (props) => {
  const {
    className,
    disabled,
    error,
    loading,
    onClick,
    show,
    text,
    type
  } = props;

  if (show === false) {
    return null;
  }

  let buttonType = type,
    spinnerClassName,
    errorClassName;

  if (type === undefined) {
    buttonType = 'button'
  }

  if (loading === true) {
    spinnerClassName = 'fas fa-sync fa-spin loading'
  } else {
    spinnerClassName = 'fas fa-sync fa-spin'
  }

  if (error === true) {
    errorClassName = 'fas fa-exclamation-circle visible'
  } else {
    errorClassName = 'fas fa-exclamation-circle'
  }

  return (
    <button
      type={ buttonType }
      className={ className }
      onClick={ onClick }
      disabled={ disabled === true }>
      <div className="fa-sm">
        <i className={ spinnerClassName }/>
        <span className="button-text">{ text }</span>
        <i className={ errorClassName }/>
      </div>
    </button>
  )
};

export default AppButton;