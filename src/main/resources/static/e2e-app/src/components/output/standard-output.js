import React from 'react'

const StandardOutput = (props) => {
  let inputElements = null, errorElements = null, messageElements = null;
  const { messages, stdInput, stdErr } = props;

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
  }

  return (
    <div className="output">
      { messageElements }
      { errorElements }
    </div>
  )
};

export default StandardOutput