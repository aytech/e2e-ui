import React from 'react'

const StandardOutput = (props) => {
  let
    inputElements = null,
    errorElements = null,
    messageElements = null,
    output = null;
  const {
    debug,
    error,
    messages,
    stdInput,
    stdErr
  } = props;

  if (messages.length > 0) {
    messageElements = messages.map(
      (line, index) => <p className="text-success" key={ index }>{ line }</p>
    )
  }

  if (stdInput.length > 0) {
    inputElements = stdInput.map(
      (line, index) => <p className="text-success" key={ index }>{ line }</p>
    )
  }

  if (stdErr.length > 0) {
    errorElements = stdErr.map(
      (line, index) => <p className="text-danger" key={ index }>{ line }</p>
    )
  } else {
    errorElements = (
      <p className="text-success">
        No errors were logged by the process.
      </p>
    );
  }

  if (debug === true) {
    output = inputElements;
  } else if (error === true) {
    output = errorElements;
  } else {
    output = messageElements;
  }

  return (
    <div className="output">
      { output }
    </div>
  )
};

export default StandardOutput